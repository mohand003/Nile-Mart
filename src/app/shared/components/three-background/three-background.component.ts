import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { ThreeBackgroundService } from '../../../core/services/background/three-background.service';

@Component({
  selector: 'app-three-background',
  standalone: true,
  templateUrl: './three-background.component.html',
  styleUrls: ['./three-background.component.css'],
})
export class ThreeBackgroundComponent implements AfterViewInit {
  constructor(
    private threeBackgroundService: ThreeBackgroundService,
    private el: ElementRef
  ) {}

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('.three-container');
    this.threeBackgroundService.init(container);
  }
}