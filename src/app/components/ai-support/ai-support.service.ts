import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config.service';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  ticketDraft: { subject: string; description: string; category: string } | null;
}

export interface SupportTicketPayload {
  subject: string;
  description: string;
  category: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class AiSupportService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  /** Talks to our own server (server.ts /api/ai-chat), which proxies to Anthropic. */
  sendMessage(history: AiChatMessage[]): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>('/api/ai-chat', { messages: history });
  }

  /**
   * Creates a real support ticket on the main ProfitPiller backend.
   * NOTE: `support/create-ticket` needs to exist on that backend - see the
   * PR description / chat summary for the expected request/response shape.
   */
  createSupportTicket(payload: SupportTicketPayload): Observable<{ ticketId: string }> {
    return this.http.post<{ ticketId: string }>(`${this.config.baseUrl}support/create-ticket`, payload);
  }
}
