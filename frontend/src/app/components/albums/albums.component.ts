import { Component, OnInit } from '@angular/core';
import { AlbumsService } from '../../services/albums.service';
import { FavsongsService } from '../../services/favsongs.service';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { log } from 'util';

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

interface FavSongIf {
  id: number,
  songs: string,
  error: string
}

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {


  // Variable declaration
  albumItems: Array<AlbumIf>; // Save album information
  songItems: Array<SongIf>; // Save album information
  albumIndex: number; // Index of the album in the center card according to the position on albumItems (one less than album ID property)
  albumIndexMax: number; // amount of albums minus one
  songFav: object; // Save fav songs like this: { albumIndex1: [song1.song_order, song2.song_order, ...] }

  constructor(
    private albumsAPI: AlbumsService,
    private favsongsAPI: FavsongsService
  ) {}

  ngOnInit() {
    // Init variables
    this.songFav = { 0: [] };
    this.albumIndex = 0;

    // Get albums' information
    this.albumsAPI.getAlbums().subscribe( // Call service to get albums from the API
      elem => {
        this.albumItems = elem;
        // Conver to uppercase
        this.albumItems.forEach( album => {
          album.name = album.name.toUpperCase();
          album.artist_name = album.artist_name.toUpperCase();
        });
        // Get albums amount
        this.albumIndexMax = Object.keys(this.albumItems).length - 1;
        // Populate carousel and list of songs
        this.getSongItems(this.albumIndex + 1);
        this.changeCarouselContent();
      },
      err => console.log("err: ", err)
    );
  }

  // Call service to get song list from the API
  getSongItems(albumID) {
    // Create new empty list of favorite songs for this album
    if (!this.songFav.hasOwnProperty(albumID)) {
      this.songFav[albumID] = [];
    }

    this.albumsAPI.getSongs(albumID).subscribe(
      elem => {
        // Sort songs by song_order value
        const sortedSongs = elem.sort((a, b) => (a.song_order - b.song_order));
        // Conver to uppercase
        sortedSongs.forEach(song => {
          song.song_name = song.song_name.toUpperCase();
          if (song.song_label)
            song.song_label.forEach((_, i) => {
              song.song_label[i] = song.song_label[i].toUpperCase();
            });
        });
        this.songItems = sortedSongs;
      },
      err => console.log("err: ", err)
    );
    // Init this album on the fav object
    this.favThisSong(-1);
    return this.songItems;
  }

  // Move to next album (right)
  clickButtonNext() {
    let index = this.albumIndex;
    // Evaluate condition to increase index
    this.albumIndex = index + 1 > this.albumIndexMax ?
      0 :
      index + 1;
    // Update carousel content
    this.changeCarouselContent();
  }
  
  // Show the next album card (right)
  clickButtonPrev() {
    let index = this.albumIndex;
    this.albumIndex = index - 1 < 0 ?
      this.albumIndexMax :
      index - 1;
    // Update carousel content
    this.changeCarouselContent();
  }

  // Save the favorited songs in and object that related albumID with an array of the favorite songs' song_order property
  favThisSong(songID) {
    // Keep track of favorite songs with backend *********************************** //

    let albumID = this.albumIndex;
    
    
    if ( songID < 0 ) { // When favThisSong is called with 'songID = -1', get the favorite songs for this album.
    this.favsongsAPI.getFavSongs(albumID).subscribe(
      elem => {
        this.songFav[albumID] = (elem.songs === "") ? [] : elem.songs.split(',').map( i => {return Number(i)} );
      },
      err => console.log("err: ", err)
      );
    } else {
      let newFavSongs = this.songFav[albumID];
      if (!newFavSongs.includes(songID)) { // Add song if it was not favorite
        newFavSongs.push(songID);
      } else { // Delete it from array in case it already was favorite
        for (let ind = 0; ind < newFavSongs.length; ind++) { // Look for the song's index
          if (newFavSongs[ind] === songID) {
            // Remove this song from the favorite list
            newFavSongs = [
              ...newFavSongs.slice(0, ind),
              ...newFavSongs.slice(ind + 1)
            ]
            break;
          }
        }
      }
      // Update object for this album
      this.songFav[albumID] = newFavSongs;
      const newFavSongsString = newFavSongs.join(',')
      this.favsongsAPI.postFavSongs(albumID, newFavSongsString).subscribe();
    }


    // Keep track of favorite songs with no backend *********************************** //
    
    // let albumID = this.albumIndex;
    // let newFavSongs = [];
    //
    // // Init array for album if it does not exist
    // if ( this.songFav.hasOwnProperty(albumID) ) {
    //   newFavSongs = this.songFav[albumID];
    // }
    
    // // Check if this song is already favorite
    // if ( ! newFavSongs.includes(songID) ) { // Add song if it was not favorite
    //   newFavSongs.push(songID);
    // } else { // Delete it from array in case it already was favorite
    //   for (let ind = 0; ind < newFavSongs.length; ind++){ // Look for the song's index
    //     if (newFavSongs[ind] === songID){
    //       // Remove this song from the favorite list
    //       newFavSongs = [
    //         ...newFavSongs.slice(0, ind),
    //         ...newFavSongs.slice(ind + 1)
    //       ]
    //       break;
    //     }
    //   }      
    // }
    // // Update object for this album
    // this.songFav[albumID] = newFavSongs;

  }

  // This function calculates the correct index for any album card since the position in the carousel can be out of the range of the albumItems object when moving to other albums. 
  // In case the index is out of the range, this function will return the proper value
  getIndex(i) {
    const maxIndex = this.albumIndexMax;    
    return ( i < 0 ?
      maxIndex + i + 1 :
      ( i > maxIndex ? 
        i - maxIndex - 1 :
        i
    ));
  }

  // Set the content for the cards in the carousel by ID.
  changeCarouselContent() {
    // Save current album index
    const i = this.albumIndex;
    
    // document.getElementById("album-image-back-left").src = this.albumItems[this.getIndex(i - 2)].cover_photo_url;
    document.getElementById("album-image-back-left").setAttribute('src', this.albumItems[this.getIndex(i - 2)].cover_photo_url);
    document.getElementById("album-name-back-left").textContent = this.albumItems[this.getIndex(i - 2)].name;
    document.getElementById("album-artist-back-left").textContent = this.albumItems[this.getIndex(i - 2)].artist_name;

    document.getElementById("album-image-middle-left").setAttribute('src', this.albumItems[this.getIndex(i - 1)].cover_photo_url);
    document.getElementById("album-name-middle-left").textContent = this.albumItems[this.getIndex(i - 1)].name;
    document.getElementById("album-artist-middle-left").textContent = this.albumItems[this.getIndex(i - 1)].artist_name;

    document.getElementById("album-image-center").setAttribute('src', this.albumItems[this.getIndex(i)].cover_photo_url);
    document.getElementById("album-name-center").textContent = this.albumItems[this.getIndex(i)].name;
    document.getElementById("album-artist-center").textContent = this.albumItems[this.getIndex(i)].artist_name;

    document.getElementById("album-image-middle-right").setAttribute('src', this.albumItems[this.getIndex(i + 1)].cover_photo_url);
    document.getElementById("album-name-middle-right").textContent = this.albumItems[this.getIndex(i + 1)].name;
    document.getElementById("album-artist-middle-right").textContent = this.albumItems[this.getIndex(i + 1)].artist_name;

    document.getElementById("album-image-back-right").setAttribute('src', this.albumItems[this.getIndex(i + 2)].cover_photo_url);
    document.getElementById("album-name-back-right").textContent = this.albumItems[this.getIndex(i + 2)].name;
    document.getElementById("album-artist-back-right").textContent = this.albumItems[this.getIndex(i + 2)].artist_name;


    // Update song list
    this.getSongItems(i + 1);
  }

  clickedSong() {
    if (((<HTMLTextAreaElement>event.target).type === 'submit') || ((<HTMLTextAreaElement>event.target).classList[0] === 'song-id')) { // If the star button or the song ID is clicked, do not active the song
      return;
    }
    if ( document.getElementById("clicked-song") ) { // Remove current active song, if any
      const currentElem = document.getElementById("clicked-song");
      currentElem.removeAttribute('id');
      if (currentElem === event.target) { // If the clicked song was already active, exit
        return;
      }
    }
    // Add ID to new active song
    (<HTMLTextAreaElement>event.target).setAttribute('id', 'clicked-song');
  }

}
