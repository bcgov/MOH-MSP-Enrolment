import { Component, OnInit, Input } from '@angular/core';

export interface ColumnClass {
  label: string;
  value: string;
}

@Component({
  standalone: false,
  selector: 'msp-review-part',
  templateUrl: './review-part.component.html',
  styleUrls: ['./review-part.component.scss']
})
export class ReviewPartComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() columnClass: ColumnClass;
  @Input() underlineLabel = false;

  _defaultColumnClass: ColumnClass = {label: 'col-6', value: 'col-6'};

  ngOnInit() {
    if (this.columnClass) {
      Object.keys(this.columnClass).map(x => this._defaultColumnClass[x] = this.columnClass[x]);
    }
  }
}
