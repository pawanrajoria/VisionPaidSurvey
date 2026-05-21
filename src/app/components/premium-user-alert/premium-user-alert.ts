import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-premium-user-alert',
  imports: [MatDialogModule],
  templateUrl: './premium-user-alert.html',
  styleUrl: './premium-user-alert.scss'
})
export class PremiumUserAlertComponent implements OnInit {

  countdown = 3;

  constructor(
    private dialogRef: MatDialogRef<PremiumUserAlertComponent>
  ) { }

  ngOnInit(): void {

    const interval = setInterval(() => {

      this.countdown--;

      if (this.countdown <= 0) {

        clearInterval(interval);

        this.close();
      }

    }, 1000);
  }

  close(): void {
    this.dialogRef.close();
  }
}