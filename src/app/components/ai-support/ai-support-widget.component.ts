import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AiSupportService, AiChatMessage } from './ai-support.service';

interface DisplayMessage extends AiChatMessage {
  ticketDraft?: { subject: string; description: string; category: string } | null;
}

@Component({
  selector: 'app-ai-support-widget',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule,
  ],
  templateUrl: './ai-support-widget.component.html',
  styleUrl: './ai-support-widget.component.scss',
})
export class AiSupportWidgetComponent implements AfterViewChecked {
  private readonly aiSupport = inject(AiSupportService);

  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;

  readonly open = signal(false);
  readonly sending = signal(false);
  readonly draft = signal('');
  readonly messages = signal<DisplayMessage[]>([
    { role: 'assistant', content: "Hi! I'm the ProfitPiller assistant. Ask me anything about surveys, offers, payouts, or your account - and I can raise a support ticket for you if you need one." },
  ]);

  // Ticket confirmation state - shown when the AI drafts a ticket
  readonly ticketOpen = signal(false);
  readonly ticketSubject = signal('');
  readonly ticketDescription = signal('');
  readonly ticketCategory = signal('other');
  readonly ticketEmail = signal('');
  readonly ticketSubmitting = signal(false);
  readonly ticketSubmitted = signal(false);
  readonly ticketError = signal<string | null>(null);

  private shouldScroll = false;

  toggle(): void {
    this.open.update(v => !v);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollAnchor?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      this.shouldScroll = false;
    }
  }

  send(): void {
    const text = this.draft().trim();
    if (!text || this.sending()) return;

    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.draft.set('');
    this.sending.set(true);
    this.shouldScroll = true;

    const history: AiChatMessage[] = this.messages().map(({ role, content }) => ({ role, content }));

    this.aiSupport.sendMessage(history).subscribe({
      next: res => {
        this.messages.update(m => [...m, { role: 'assistant', content: res.reply, ticketDraft: res.ticketDraft }]);
        this.sending.set(false);
        this.shouldScroll = true;
        if (res.ticketDraft) {
          this.openTicketForm(res.ticketDraft);
        }
      },
      error: () => {
        this.messages.update(m => [...m, {
          role: 'assistant',
          content: "Sorry, I'm having trouble responding right now. You can raise a support ticket instead if it's urgent.",
        }]);
        this.sending.set(false);
        this.shouldScroll = true;
      },
    });
  }

  openTicketForm(draft?: { subject: string; description: string; category: string }): void {
    this.ticketSubject.set(draft?.subject ?? '');
    this.ticketDescription.set(draft?.description ?? this.lastUserMessage());
    this.ticketCategory.set(draft?.category ?? 'other');
    this.ticketSubmitted.set(false);
    this.ticketError.set(null);
    this.ticketOpen.set(true);
  }

  closeTicketForm(): void {
    this.ticketOpen.set(false);
  }

  submitTicket(): void {
    if (!this.ticketSubject().trim() || !this.ticketDescription().trim()) return;
    this.ticketSubmitting.set(true);
    this.ticketError.set(null);

    this.aiSupport.createSupportTicket({
      subject: this.ticketSubject(),
      description: this.ticketDescription(),
      category: this.ticketCategory(),
      email: this.ticketEmail() || undefined,
    }).subscribe({
      next: () => {
        this.ticketSubmitting.set(false);
        this.ticketSubmitted.set(true);
      },
      error: () => {
        this.ticketSubmitting.set(false);
        this.ticketError.set("Couldn't submit the ticket right now - please try again in a moment.");
      },
    });
  }

  private lastUserMessage(): string {
    const userMessages = this.messages().filter(m => m.role === 'user');
    return userMessages.length ? userMessages[userMessages.length - 1].content : '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
