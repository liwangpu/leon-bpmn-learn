import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-moddle',
  templateUrl: './moddle.component.html',
  styleUrls: ['./moddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModdleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
