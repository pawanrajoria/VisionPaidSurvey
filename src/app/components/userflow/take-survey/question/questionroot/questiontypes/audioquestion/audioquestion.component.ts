import { Component, Input, OnInit } from '@angular/core';
import { QualQuestionVM } from '../../../../../respondent.vm';

@Component({
  selector: 'audioquestion',
  templateUrl: './audioquestion.component.html',
  styleUrls: ["./audioquestion.component.scss"]
})
export class AudioQuestionComponent implements OnInit {
  @Input() field: QualQuestionVM = new QualQuestionVM;
  @Input() form: any;
  isPlaying = false;
  audio = new Audio();
  progress = "0%";

  constructor() {

  }

  ngOnInit(): void {
    const self = this;
    this.audio.src = this.field.src;
    this.audio.load();
    this.audio.onended = function () {
      self.form.controls[self.field.qKey].setValue("AudioCompleted");
    };
    this.audio.addEventListener("timeupdate", (currentTime) => {
      this.setProgress(this.audio.currentTime, this.audio.duration);
    });
  }

  setProgress(currentValue: number, totalValue: number) {
    const status: number = (currentValue / totalValue) * 100;
    this.progress = `${parseInt(status.toString())}%`;
  }

  playAudio() {
    this.audio.play();
    this.isPlaying = true;
  }

  pauseAudio() {
    this.audio.pause();
    this.isPlaying = false;
  }

}
