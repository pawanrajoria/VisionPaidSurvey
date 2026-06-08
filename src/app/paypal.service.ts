import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaypalService {

    private apiUrl = 'http://localhost:3000/api';
    // Your backend URL

    constructor(private http: HttpClient) { }

    // Get PayPal Access Token
    getAccessToken(): Observable<any> {
        return this.http.get(`${this.apiUrl}/paypal/token`);
    }

    // Send Withdrawal Request
    sendWithdrawal(email: string, amount: number): Observable<any> {
        const body = { email, amount };
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post(
            `${this.apiUrl}/paypal/withdraw`,
            body,
            { headers }
        );
    }

    // Check Payout Status
    checkPayoutStatus(payoutId: string): Observable<any> {
        return this.http.get(
            `${this.apiUrl}/paypal/status/${payoutId}`
        );
    }
}