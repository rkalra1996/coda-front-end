import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LeaderboarUtilsService } from './services/leaderboar-utils.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatchDialogComponent } from './components/match-dialog/match-dialog.component';
import { fromEvent, of, Subscription } from 'rxjs';
import { catchError, debounceTime, map, startWith } from 'rxjs/operators';
import { ILeaderboard, ILeaderboardResponse } from './interfaces/leaderboard.interface';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  tableData: MatTableDataSource<ILeaderboard>;
  displayedColumns = ['select', 'team_name', 'wins', 'losses', 'ties', 'score']
  fetching = null;
  canMatch = false;
  currentPage = 0;
  pageSize = 0;
  totalDataCount = 0;
  socketSub$: Subscription | null = null
  pageFetch = null
  input$: Subscription | null = null
  selection = new SelectionModel<ILeaderboard>(true, []);
  constructor(
    private readonly leaderboardUtilSrvc: LeaderboarUtilsService, 
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private readonly snackbar: MatSnackBar,
    ) {}

  @ViewChild(MatTable) table: MatTable<ILeaderboard>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input:ElementRef;

  async updateTable(page: number, size: number, query = '') {
    this.pageFetch = 'fetching'
    const rendered = await this.renderTable(page, size, query);
    if (rendered) {
      this.pageFetch = 'done'
      this.table.renderRows();
    } else {
      this.pageFetch = 'error'
      this.fetching = 'error'
    }
  }

  verifySelection(event: any, row: any) {
    if (event) {
      this.selection.toggle(row)
    }
    if (this.selection.selected.length == 2) {
      this.canMatch = true
    } else {
      this.canMatch = false
    }
  }

  async renderTable(page = 0, size = 10, query = '') {
    try {
      const response = await this.leaderboardUtilSrvc.getAllData(page, size, query) as ILeaderboardResponse;
      const dataForTable = new MatTableDataSource(response.data.data);
      this.renderTableData(response, dataForTable);
      window.setTimeout(()=>{
        this.tableData.sort = this.sort;
        if (!this.input$) {
          this.input$ = this.subscribeToInputEl().subscribe(data => {
            this.applyFilter(data)
          })
        }
      })
      if (!this.socketSub$) {
        this.socketSub$ = this.leaderboardUtilSrvc.leaderboardSocket.subscribe((_: any)=> this.updateTable(this.currentPage, this.pageSize))
      }
      return await true;
    } catch(err) {
      console.error('An Error occured while reading details', err);
      return await false;
    }
  }

  applyFilter(search: string) {
    this.tableData.filter = search.trim().toLowerCase();
  }

  subscribeToInputEl() {
    return fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      startWith(''),
      debounceTime(500),
    );
  }

  renderTableData(originalResponse: any, matTable: any) {
      this.tableData = matTable;
      this.currentPage = originalResponse.data.page;
      this.pageSize = originalResponse.data.size;
      this.totalDataCount = originalResponse.data.total;
  }

  async ngOnInit() {
    this.fetching = 'fetching';
    if (await this.renderTable()) {
      this.fetching = 'done';
    } else {
      this.fetching = 'error';
    }
  }

  openMenu() {
    this._bottomSheet.open(AddTeamComponent, {autoFocus: true});
  }

  openMatchMenu() {
    const dialogRef = this.dialog.open(MatchDialogComponent, {
      width: '60%',
      height: '300px',
      data: this.selection.selected,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selection.clear();
        this.canMatch = false;
        // prepare data for updation of team info
        const body = this.leaderboardUtilSrvc.prepareTeamUpdationData(result);
        this.leaderboardUtilSrvc.updateMatchInfo(body).pipe(catchError(_ => {
          this.snackbar.open('Failed to update match info, try again later!', 'info');
          return of({
            ok: false,
            data: null,
            status: 500,
            error: _.error
          })
        })).subscribe(_ => null);
      }
    });
  }

  fetchData(event: any) {
    this.updateTable(event.pageIndex, event.pageSize)
  }

  ngOnDestroy() {
    if (this.socketSub$) {
      this.socketSub$.unsubscribe();
    }
  }
}
