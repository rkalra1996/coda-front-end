import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

const APIS = {
  endpoint: 'https://pacific-stream-42469.herokuapp.com/leaderboard',
  updateMatch: () => `${APIS.endpoint}/update`,
  getLBData: (page: number, size: number) => `${APIS.endpoint}?page=${page}&size=${size}`
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboarUtilsService {

  constructor(private readonly socket: Socket, private readonly http: HttpClient) { }

  get leaderboardSocket() {
    return this.socket.fromEvent('leaderboard-update')
  }

  getAllData(page = 0, size = 10) {
    return this.http.get(APIS.getLBData(page,size)).toPromise();
  }

  prepareTeamUpdationData(data: any) {
    const teamsBody = {
      teams: [],
    }
    if (Array.isArray(data.wins)) {
      const winnerTeams = data.wins.map(team => {
        return {
          _id: team._id,
          team_name: team.team_name,
          won: 1,
          tie: 0,
          lose: 0,
        }
      })
      teamsBody.teams.push(...winnerTeams);
    }

    if (Array.isArray(data.lose)) {
      const loserTeams = data.lose.map(team => {
        return {
          team_name: team.team_name,
          _id: team._id,
          lose: 1,
          won: 0,
          tie: 0,
        }
      })
      teamsBody.teams.push(...loserTeams)
    }

    if (Array.isArray(data.tie)) {
      const tieTeams = data.tie.map(team => {
        return {
          team_name: team.team_name,
          _id: team._id,
          tie: 1,
          lose: 0,
          won: 0,
        }
      })
      teamsBody.teams.push(...tieTeams);
    }
    return teamsBody;
  }

  updateMatchInfo(body: any) {
    const requestBody = {...body};
    return this.http.post(APIS.updateMatch(), {
      ...requestBody,
    })
  }
}
