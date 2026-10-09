import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SharedModule } from "../../../shared.module";
import { BaseComponent } from "../../../base.component";
import { ChatService, IChatFeed, IChatMessage } from "./chat.service";
import { EMOJI_GROUPS, QUICK_EMOJIS, isEmojiOnly } from "./chat-emoji";
import { tierForLevel } from "../engagement/engagement.vm";

const POLL_MS = 5000;
/** How close to the bottom (px) still counts as "reading the newest messages". */
const NEAR_BOTTOM = 120;

@Component({
    selector: 'app-chat',
    imports: [SharedModule],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('list') list?: ElementRef<HTMLElement>;
    @ViewChild('input') input?: ElementRef<HTMLTextAreaElement>;

    private readonly chat = inject(ChatService);
    private readonly translate = inject(TranslateService);

    loading = true;
    available = true;
    muted = false;
    isAdmin = false;
    maxLength = 300;
    messages: IChatMessage[] = [];
    hasOlder = true;
    loadingOlder = false;

    draft = '';
    sending = false;
    error = '';
    /** New messages arrived while the user was reading older ones. */
    unseen = 0;

    /** Emoji a message can be reacted with (from the server; empty = reactions off). */
    reactionEmojis: string[] = [];
    /** Id of the message whose reaction picker is open. */
    reactingTo = 0;
    emojiOpen = false;
    emojiGroup = 0;
    readonly emojiGroups = EMOJI_GROUPS;
    readonly quickEmojis = QUICK_EMOJIS;
    private readonly jumboCache = new Map<number, boolean>();

    private timer: ReturnType<typeof setInterval> | undefined;
    private polling = false;

    async ngOnInit() {
        if (!this.isBrowser) { this.loading = false; return; }

        document.body.classList.add('chat-open');
        try {
            this.apply(await this.chat.getFeed());
            this.hasOlder = this.messages.length >= 50;
        } catch {
            this.available = false;
        }
        this.loading = false;
        this.scrollToBottom();

        // Poll only while the tab is visible - a hidden tab asking every 5 seconds is wasted work.
        this.timer = setInterval(() => { if (!document.hidden) this.poll(); }, POLL_MS);
    }

    ngOnDestroy(): void {
        if (this.timer) clearInterval(this.timer);
        if (this.isBrowser) document.body.classList.remove('chat-open');
    }

    get lastId(): number { return this.messages.length ? this.messages[this.messages.length - 1].id : 0; }
    get remaining(): number { return this.maxLength - this.draft.length; }
    get canSend(): boolean { return !this.sending && !this.muted && this.draft.trim().length > 0 && this.remaining >= 0; }

    private apply(feed: IChatFeed) {
        this.available = !!feed?.available;
        this.muted = !!feed?.muted;
        this.isAdmin = !!feed?.isAdmin;
        this.maxLength = feed?.maxLength || 300;
        this.messages = feed?.messages ?? [];
        this.reactionEmojis = feed?.reactionEmojis ?? [];
    }

    private async poll() {
        if (this.polling || !this.available) return;
        this.polling = true;
        try {
            const feed = await this.chat.getFeed(this.lastId);
            this.muted = !!feed.muted;

            if (feed.removedIds?.length) {
                const removed = new Set(feed.removedIds);
                this.messages = this.messages.filter(m => !removed.has(m.id));
            }

            // Reactions other people added to (or took off) messages already on screen.
            if (feed.reactionsFromId) {
                const updates = new Map((feed.reactionUpdates ?? []).map(u => [u.messageId, u.reactions]));
                for (const m of this.messages) {
                    if (m.id >= feed.reactionsFromId) m.reactions = updates.get(m.id) ?? [];
                }
            }

            const known = new Set(this.messages.map(m => m.id));
            const fresh = (feed.messages ?? []).filter(m => !known.has(m.id));
            if (fresh.length) {
                const atBottom = this.isNearBottom();
                this.messages = [...this.messages, ...fresh];
                if (atBottom) this.scrollToBottom(); else this.unseen += fresh.length;
            }
        } catch {
            /* a missed poll is retried on the next tick */
        } finally {
            this.polling = false;
        }
    }

    async loadOlder() {
        if (this.loadingOlder || !this.messages.length) return;
        this.loadingOlder = true;
        const el = this.list?.nativeElement;
        const before = el ? el.scrollHeight : 0;
        try {
            const feed = await this.chat.getFeed(0, this.messages[0].id);
            const older = feed.messages ?? [];
            this.hasOlder = older.length >= 50;
            this.messages = [...older, ...this.messages];
            // Keep the message the user was looking at in place.
            setTimeout(() => { if (el) el.scrollTop = el.scrollHeight - before; });
        } catch {
            /* keep what is shown */
        } finally {
            this.loadingOlder = false;
        }
    }

    async send() {
        if (!this.canSend) return;
        const text = this.draft.trim();
        this.sending = true;
        this.error = '';
        try {
            const result = await this.chat.send(text);
            if (!result?.isSuccess) {
                this.error = result?.message || this.translate.instant('app.chat.failed');
                return;
            }
            this.draft = '';
            this.emojiOpen = false;
            if (result.sent && !this.messages.some(m => m.id === result.sent!.id)) {
                this.messages = [...this.messages, result.sent];
            }
            this.unseen = 0;
            this.scrollToBottom();
        } catch {
            this.error = this.translate.instant('app.chat.failed');
        } finally {
            this.sending = false;
        }
    }

    /** Enter sends, Shift+Enter makes a new line. */
    onKey(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
            event.preventDefault();
            this.send();
        }
    }

    // ───────────── Emoji and reactions ─────────────

    /** Puts the emoji where the cursor is and keeps typing there. */
    insertEmoji(emoji: string) {
        if (this.draft.length + emoji.length > this.maxLength) return;
        const el = this.input?.nativeElement;
        const start = el?.selectionStart ?? this.draft.length;
        const end = el?.selectionEnd ?? this.draft.length;
        this.draft = this.draft.slice(0, start) + emoji + this.draft.slice(end);
        setTimeout(() => {
            if (!el) return;
            el.focus();
            el.selectionStart = el.selectionEnd = start + emoji.length;
        });
    }

    toggleReactionPicker(message: IChatMessage, event: Event) {
        event.stopPropagation();
        this.reactingTo = this.reactingTo === message.id ? 0 : message.id;
    }

    /** A click anywhere else closes the open reaction picker. */
    closePopovers() {
        this.reactingTo = 0;
    }

    hasReacted(message: IChatMessage, emoji: string): boolean {
        return !!message.reactions?.some(r => r.emoji === emoji && r.mine);
    }

    /** Shows the change at once, then takes the server's totals (or rolls back if it failed). */
    async react(message: IChatMessage, emoji: string) {
        this.reactingTo = 0;
        if (this.muted) return;

        const before = message.reactions ?? [];
        const existing = before.find(r => r.emoji === emoji);
        message.reactions = existing?.mine
            ? before.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, mine: false } : r).filter(r => r.count > 0)
            : existing
                ? before.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r)
                : [...before, { emoji, count: 1, mine: true }];

        try {
            const result = await this.chat.react(message.id, emoji);
            message.reactions = result?.isSuccess ? (result.reactions ?? []) : before;
        } catch {
            message.reactions = before;
        }
    }

    /** One to three emoji and nothing else are shown large. */
    isJumbo(message: IChatMessage): boolean {
        let value = this.jumboCache.get(message.id);
        if (value === undefined) {
            value = isEmojiOnly(message.message);
            this.jumboCache.set(message.id, value);
        }
        return value;
    }

    /** Admins can remove a message straight from the chat. */
    async remove(message: IChatMessage) {
        if (!this.isAdmin) return;
        try {
            const result = await this.chat.remove(message.id);
            if (result?.isSuccess) this.messages = this.messages.filter(m => m.id !== message.id);
        } catch {
            /* the interceptor already told the admin */
        }
    }

    onScroll() {
        if (this.unseen && this.isNearBottom()) this.unseen = 0;
    }

    jumpToNewest() {
        this.unseen = 0;
        this.scrollToBottom();
    }

    private isNearBottom(): boolean {
        const el = this.list?.nativeElement;
        return !el || el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
    }

    private scrollToBottom() {
        setTimeout(() => {
            const el = this.list?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }

    tierColor(level: number): string { return tierForLevel(level).color; }

    /** "IN" -> 🇮🇳 (regional-indicator letters); anything else -> empty. */
    flag(code: string): string {
        const value = (code ?? '').trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(value)) return '';
        return String.fromCodePoint(...[...value].map(c => 0x1f1e6 + c.charCodeAt(0) - 65));
    }

    /** True when this message starts a new day, so a date divider is shown above it. */
    newDay(index: number): boolean {
        if (index === 0) return true;
        return new Date(this.messages[index].createdAt).toDateString() !== new Date(this.messages[index - 1].createdAt).toDateString();
    }

    trackMessage(_: number, message: IChatMessage): number { return message.id; }
}
