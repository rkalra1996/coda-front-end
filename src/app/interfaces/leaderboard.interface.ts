export interface ILeaderboard {
    _id: string;
    position: number;
    team_name: string;
    wins: number;
    losses: number;
    ties: number;
    score: number;
}

export interface IleaderboardResponseData {
    data: ILeaderboard[],
    page: number,
    total: number,
    size: number,
}

export interface ILeaderboardResponse {
    ok: boolean;
    error: string | null;
    data: null | IleaderboardResponseData;
    status: number;
}