import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-match-dialog',
  templateUrl: './match-dialog.component.html',
  styleUrls: ['./match-dialog.component.scss']
})
export class MatchDialogComponent implements OnInit {

  fetching = 'fetching'
  team1 = null
  team2 = null
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.length === 2) {
      this.team1 = this.data[0]
      this.team2 = this.data[1]
      this.fetching = 'done'
    }
    else {
      this.fetching = 'error'
    }
  }
}
