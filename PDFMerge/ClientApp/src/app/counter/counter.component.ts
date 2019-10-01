import { Component } from '@angular/core';
import { ApplicationStateService } from '../services/application-state.service';
import { FileModel } from '../model/file.model';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;
  public data : FileModel[];
  public incrementCounter() {
    this.currentCount++;
  }
  constructor(private applicationStateService: ApplicationStateService) {
    this.data = this.applicationStateService.data;
  }
}
