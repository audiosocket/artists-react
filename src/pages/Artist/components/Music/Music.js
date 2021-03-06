import React from "react";
import "./Music.scss";
import {Route, Switch} from "react-router-dom";
import AlbumsListing from "./AlbumsListing";
import Album from "./Album";
import TracksListing from "./TracksListing";
import Track from "./Track";
import AlbumEdit from "./AlbumEdit";
import AlbumArtwork from "./AlbumArtwork";
import {ArtistContext} from "../../../../Store/artistContext";


function Music() {
  const {artistState} = React.useContext(ArtistContext);

  return (
    <Switch>
      <Route
        exact={true}
        path="/music/album/:id"
        render={(props) => <Album id={props.match.params.id} />}
      />
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route
        exact={true}
        path="/music/album/:id/edit"
        render={(props) => <AlbumEdit id={props.match.params.id}/>}
      />
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route
        exact={true}
        path="/music/album/:id/artwork"
        render={(props) => <AlbumArtwork id={props.match.params.id}/>}
      />
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route
        exact={true}
        path="/music/album/:id/tracks"
        render={(props) => <TracksListing id={props.match.params.id}/>}
      />
      }
      {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
      <Route
        exact={true}
        path="/music/album/:id/tracks/:trackId"
        render={(props) => <Track id={props.match.params.id} trackId={props.match.params.trackId}/>}
      />
      }
      <Route
        path="/music">
        <AlbumsListing />
      </Route>
    </Switch>
  )
}

export default Music;