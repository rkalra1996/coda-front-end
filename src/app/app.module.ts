import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { LeaderboarUtilsService } from './services/leaderboar-utils.service';
import {HttpClientModule} from '@angular/common/http'
import { AddTeamComponent } from './components/add-team/add-team.component';
import { FormsModule} from '@angular/forms';
import { MaterialDependenciesModule } from 'src/modules/material-dependencies/material-dependencies.module';
import { MatchDialogComponent } from './components/match-dialog/match-dialog.component';

const config: SocketIoConfig = { url: 'https://pacific-stream-42469.herokuapp.com/', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    AddTeamComponent,
    MatchDialogComponent
  ],
  imports: [
    BrowserModule,
    MaterialDependenciesModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [LeaderboarUtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
