import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './components/albums/albums.component';

const routes: Routes =[
  // { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '', component: AlbumsComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    AlbumsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
