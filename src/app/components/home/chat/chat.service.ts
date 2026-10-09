import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../../../config.service";
import { BACKGROUND } from "../engagement/engagement.service";

export interface IChatMessage {
    id: number;
    name: string;
    countryCode: string;
    level: number;
    message: string;
    createdAt: string;
    isMine: boolean;
    /** web | android | ios */
    platform: string;
    /** '' = a normal message, 'welcome' = the automatic "joined the community" message. */
    kind?: string;
    reactions?: IChatReaction[];
}

export interface IChatReaction {
    emoji: string;
    count: number;
    /** The signed-in user gave this reaction. */
    mine: boolean;
}

export interface IChatReactResult {
    isSuccess: boolean;
    message: string;
    reactions: IChatReaction[];
}

export interface IChatFeed {
    available: boolean;
    muted: boolean;
    isAdmin: boolean;
    maxLength: number;
    secondsBetweenMessages: number;
    messages: IChatMessage[];
    removedIds: number[];
    /** Emoji a message can be reacted with; empty when reactions are switched off. */
    reactionEmojis?: string[];
    /** While polling: current reactions of every message from reactionsFromId on that has any. */
    reactionUpdates?: { messageId: number; reactions: IChatReaction[] }[];
    reactionsFromId?: number;
}

export interface IChatSendResult {
    isSuccess: boolean;
    message: string;
    sent?: IChatMessage | null;
}

export interface IAdminChatMessage {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    countryCode: string;
    message: string;
    platform: string;
    createdAt: string;
    isDeleted: boolean;
    isMuted: boolean;
}

/** Community chat shared by the website and the app. The page polls; nothing here keeps a connection open. */
@Injectable({ providedIn: 'root' })
export class ChatService {
    constructor(private http: HttpClient, private config: ConfigService) { }

    private get base(): string { return this.config.baseUrl + "chat/"; }

    /** No ids: latest messages. afterId: only newer ones. beforeId: the older page. Never shows the loader. */
    getFeed(afterId = 0, beforeId = 0): Promise<IChatFeed> {
        let params = new HttpParams();
        if (afterId > 0) params = params.set('afterId', afterId);
        if (beforeId > 0) params = params.set('beforeId', beforeId);
        return firstValueFrom(this.http.get<IChatFeed>(this.base + "messages", { ...BACKGROUND, params }));
    }

    send(message: string): Promise<IChatSendResult> {
        return firstValueFrom(this.http.post<IChatSendResult>(this.base + "messages", { message }, BACKGROUND));
    }

    /** Adds the reaction, or takes it back when the user already gave it. */
    react(id: number, emoji: string): Promise<IChatReactResult> {
        return firstValueFrom(this.http.post<IChatReactResult>(this.base + `messages/${id}/react`, { emoji }, BACKGROUND));
    }

    // ───────────── Moderation (administrators) ─────────────
    adminMessages(beforeId = 0, take = 100): Promise<IAdminChatMessage[]> {
        let params = new HttpParams().set('take', take);
        if (beforeId > 0) params = params.set('beforeId', beforeId);
        return firstValueFrom(this.http.get<IAdminChatMessage[]>(this.base + "admin/messages", { params }));
    }

    remove(id: number): Promise<{ isSuccess: boolean; message: string }> {
        return firstValueFrom(this.http.post<{ isSuccess: boolean; message: string }>(this.base + `admin/messages/${id}/remove`, {}));
    }

    restore(id: number): Promise<{ isSuccess: boolean; message: string }> {
        return firstValueFrom(this.http.post<{ isSuccess: boolean; message: string }>(this.base + `admin/messages/${id}/restore`, {}));
    }

    mute(userId: number, muted: boolean, removeMessages = false, reason = ''): Promise<{ isSuccess: boolean; message: string }> {
        return firstValueFrom(this.http.post<{ isSuccess: boolean; message: string }>(
            this.base + `admin/users/${userId}/mute`, { muted, removeMessages, reason }));
    }
}
