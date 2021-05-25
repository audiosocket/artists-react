import "./Music.scss";
import React, {useEffect, useState} from "react";
import {Accordion, Card, Breadcrumb} from 'react-bootstrap';
import {NavLink} from "react-router-dom";
import artwork from "../../../../images/artwork.jpg";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import Loader from "../../../../images/loader.svg";

function Album({id = null}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    if(artistState.albums) {
      const filteredAlbum = artistState.albums.filter(album => parseInt(album.id) === parseInt(id));
      setAlbum(filteredAlbum[0] ?? null)
    } else {
      getAlbum();
    }
  }, [])

  const getAlbum = async () => {
    setIsLoading(true);
    const albums = await fetchAlbums();
    artistActions.albumsStateChanged(albums);
    const filteredAlbum = albums.filter(album => parseInt(album.id) === parseInt(id));
    setAlbum(filteredAlbum[0] ?? null)
    setIsLoading(false);
  }

  return (
    <div className="albumsWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/music">Music</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/music">Albums</NavLink>
          </li>
          <li className="breadcrumb-item active">
            {album ? album.name : ''}
          </li>
        </Breadcrumb>
        {isLoading && !album && <h5>Loading album... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
        <div className="section-content">
          <section >
            <div className="section-head">
              <h2>{album ? album.name : ''}</h2>
              <div className="sec-controls">
                <NavLink to="/profile/edit" className="btn primary-btn mr-2">Edit</NavLink>
                <NavLink to="/profile/edit" className="close-btn btn btn-outline-danger delete">Delete</NavLink>
              </div>
            </div>
            <div className="section-body">
              <div className="bg-content yellow bgSecondVersion">
                <p>Please make sure you edit your track metadata carefully, make sure it looks the way you'd like it to be seen in the player. Once you upload music and assign writers to the tracks, please remember to check the blue <strong>"Submit To Classification"</strong> button on each track and the music will become available to our team for review. If you forget this part, your music will not be available to us.</p>
                <p className="mb-0">Original material only please! We do not accept cover songs or songs containing samples. Unless it's public domain, you and your collaborators must own all the copyrights to the music you're submitting.</p>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <div className="section-head">
              <h2>Artwork</h2>
              <NavLink to="/profile/edit" className="btn primary-btn">Edit</NavLink>
              <p className="sec-head-para mb-0">Time to add some artwork to this album! Click the Edit button above to get started.</p>
            </div>
            <div className="section-body">
              <div className="artwork-images-sec">
                <div className="artwork-image">
                  <img src={artwork} alt="Artwork"/>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <div className="section-head">
              <h2>Tracks</h2>
              <NavLink to="/profile/edit" className="btn primary-btn mr-2">Add music</NavLink>
            </div>
            <div className="section-body">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>Hello! I'm the body</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Click me!
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </section>
        </div>
      </div>

    </div>
  )
}

export default Album;