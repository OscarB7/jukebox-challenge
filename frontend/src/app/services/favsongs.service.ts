import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { range } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

interface FavSongIf {
  id: number,
  songs: string,
  error: string
}

@Injectable({
  providedIn: 'root'
})
export class FavsongsService {

  constructor(private url: HttpClient) { }

  // Connect to the backend REST API to get and save favorite songs

  getFavSongs(albumID) {
    return this.url.get<FavSongIf>(`http://localhost:3000/favsongs/${albumID}`);
  }

  postFavSongs(albumID, songs) {
    return this.url.post(`http://localhost:3000/favsongs/${albumID}?songs=${songs}`, null);
  }
  
}
