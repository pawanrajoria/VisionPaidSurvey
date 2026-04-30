import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedModule } from "../../../shared.module";

interface Activity {
    user: string;
    amount: number;
    time: string;
}

@Component({
    selector: 'app-live-payout',
    imports: [SharedModule],
    templateUrl: './live-payout.component.html',
    styleUrls: ['./live-payout.component.scss']
})
export class LivepayoutComponent implements OnInit, OnDestroy {

    recentActivities: Activity[] = [];
    isExpanded = false; // Controls visibility
    private tickerInterval: any;

    // Dynamic generated users
    private names: string[] = [];

    private amounts = [100, 250, 500, 750, 1000, 1500, 2000];
    private times = ['Just now', '2 sec ago', '5 sec ago', '10 sec ago'];

    // Username generator pools
    private prefixes = [
        'User', 'Member', 'Earn', 'Cash', 'Reward', 'Survey', 'Task',
        'Quick', 'Daily', 'Bonus', 'Coin', 'Pay', 'Win', 'Smart', 'Fast'
    ];

    private suffixes = [
        'Pro', 'Hub', 'King', 'Master', 'Player', 'Buddy',
        'Flow', 'Zone', 'Point', 'Star', 'Edge', 'Pulse'
    ];

    ngOnInit() {

        this.names = this.generateBulkUsers(1000);

        // preload
        for (let i = 0; i < 3; i++) {
            this.addRandomActivity();
        }

        // start dynamic ticker
        this.startTicker();
    }

    toggleTicker() {
        this.isExpanded = !this.isExpanded;
    }

    private startTicker() {
        const randomDelay = this.getRandomDelay();

        this.tickerInterval = setTimeout(() => {
            this.addRandomActivity();
            this.startTicker(); // recursive call → keeps it running
        }, randomDelay);
    }

    private getRandomDelay(): number {
        // between 3 sec to 9 sec (natural feel)
        return Math.floor(Math.random() * 6000) + 3000;
    }

    private addRandomActivity() {
        const newActivity: Activity = {
            user: this.getRandomUser(),
            amount: this.getRandomAmount(),
            time: this.getRandomTime()
        };

        this.recentActivities.unshift(newActivity);

        // Increased limit to 100 as requested
        if (this.recentActivities.length > 100) {
            this.recentActivities.pop();
        }
    }

    private getRandomUser(): string {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }

    private getRandomAmount(): number {
        return this.amounts[Math.floor(Math.random() * this.amounts.length)];
    }

    private getRandomTime(): string {
        return this.times[Math.floor(Math.random() * this.times.length)];
    }

    private generateUsername(): string {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const number = Math.floor(Math.random() * 9000 + 100);
        return `${prefix}${suffix}_${number}`;
    }

    private generateBulkUsers(count: number = 1000): string[] {
        const users = new Set<string>();

        while (users.size < count) {
            users.add(this.generateUsername());
        }

        return Array.from(users);
    }

    ngOnDestroy() {
        if (this.tickerInterval) {
            clearInterval(this.tickerInterval);
        }
    }
}