import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { range } from "rxjs";
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';


interface AlbumIf {
  id: number,
  name: string,
  artist_name: string,
  cover_photo_url: string
}

interface SongIf {
  id: number,
  album_id: number,
  song_name: string,
  song_order: number,
  song_label: Array<string>,
  song_duration: string,
}

@Injectable({
  providedIn: "root"
})
export class AlbumsService {
  constructor(private url: HttpClient) {}



  // NOTE: The portion "https://cors-anywhere.herokuapp.com/" was added as a workaround to be able to use the API without getting CORS errros.

  
  getAlbums() {
    return this.url.get<Array<AlbumIf>>("https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/albums.json");
    // return this.url.get<Array<AlbumIf>>("https://stg-resque.hakuapp.com/albums.json"); // Correct implementation
  }

  getSongs(albumID) {
    return this.url.get<Array<SongIf>>(`https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/songs.json?album_id=${albumID}`);
    // return this.url.get<Array<SongIf>>(`https://stg-resque.hakuapp.com/songs.json?album_id=${albumID}`); // Correct implementation
  }
}
