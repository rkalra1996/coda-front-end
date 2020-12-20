import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  teamName = '';
  sending = false;

  constructor(private _bottomSheetRef: MatBottomSheetRef<AddTeamComponent>, private readonly http: HttpClient) { }

  ngOnInit(): void {
  }

  createTeam() {
    if (this.teamName.length > 3) {
      this.sending = true;
      this.http.post('https://pacific-stream-42469.herokuapp.com/leaderboard/teams/add', {
        names: [this.teamName]
      }).toPromise().then((_) => {
        // nothing to do
        this.sending = false;
        this._bottomSheetRef.dismiss();
      }).catch(_err => {
        this.sending = false;
      })
    }
  }

}
