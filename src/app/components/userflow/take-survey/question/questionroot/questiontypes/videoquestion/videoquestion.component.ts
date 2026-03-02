import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { QualQuestionVM } from '../../../../../respondent.vm';

@Component({
  selector: 'videoquestion',
  templateUrl: './videoquestion.component.html',
  styleUrls: ["./videoquestion.component.scss"]
})
export class VideoQuestionComponent implements OnInit, AfterViewInit {
  @Input() field: QualQuestionVM = new QualQuestionVM;
  @Input() form: any;
  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef | undefined;
  isPlaying = false;
  progress = "0%";
  constructor() {

  }
  ngAfterViewInit(): void {

  }

  setProgress(data: any) {
    const status: number = (data.target.currentTime / data.target.duration) * 100;
    this.progress = `${parseInt(status.toString())}%`;
    // console.log(this.progress);
  }

  ngOnInit(): void {

  }

  playVideo() {
    this.isPlaying = true;
    this.videoplayer?.nativeElement.play();
  }

  vidEnded() {
    this.form.controls[this.field.qKey].setValue("VideoCompleted");
  }
}
