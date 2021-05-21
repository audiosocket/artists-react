import React, {useEffect, useState} from "react";
import "./Profile.scss";
import cover from '../../../../images/artist-cover.jpg';
import banner from '../../../../images/artist-banner.jpg';
import {ArtistContext} from "../../../../Store/artistContext";
import fetchArtist from "../../../../common/utlis/fetchArtist";
import Loader from "../../../../images/loader.svg";
import {NavLink} from "react-router-dom";

function Profile() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});

  useEffect(() => {
    if(!artistState.artist)
      getArtistProfile();
    else
      setArtist(artistState.artist);
  }, [])

  const getArtistProfile = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setArtist(artist);
    setIsLoading(false);
  }

  return (
    <div className="artist-wrapper">
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Profile</h2>
            <NavLink to="/profile/edit" className="btn primary-btn">Edit</NavLink>
          </div>
          {isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
          <div className="section-body">
            <div className="w-custom-percent">
              <div className="parallel-info">
                <label>name</label>
                <div className="info-ans">{artist.name}</div>
              </div>

              <div className="parallel-info">
                <label>cover image</label>
                <div className="info-ans">
                  <a target="_blank" href={artist.cover_image ? artist.cover_image : cover}>
                    <img className="preview" src={artist.cover_image ? artist.cover_image : cover} alt="Cover Image" />
                  </a>
                </div>
              </div>
              <div className="parallel-info">
                <label>banner image</label>
                <div className="info-ans">
                  <a target="_blank" href={artist.banner_image ? artist.banner_image : banner}>
                    <img src={artist.banner_image ? artist.banner_image : banner} alt="Banner Image" />
                  </a>
                </div>
              </div>
              <div className="parallel-info">
                <label>additional images</label>
                <div className="info-ans additional-elements">
                  {!artist.additional_images.length
                    ?
                    <div className="bg-content yellow w-custom-bg-content">
                      Have additional images for us? <NavLink to="/profile/edit">Upload them here</NavLink> for <span
                      classname="artist-name">Jetty Rae</span>
                    </div>
                    :
                    artist.additional_images.map((image, key) => {
                      return (
                        <a key={key} className="additional-image-link" target="_blank" href={image}>
                          <img src={image} alt="Image" />
                        </a>
                      )
                    })
                  }
                </div>
              </div>
              <div className="parallel-info">
                <label>sounds like</label>
                <div className="info-ans">
                  {artist.sounds_like
                    ? artist.sounds_like
                    : '-'
                  }
                </div>
              </div>
              <div className="parallel-info">
                <label>bio</label>
                <div className="info-ans">
                  {artist.bio
                    ? artist.bio
                    : '-'
                  }
                </div>
              </div>
              <div className="parallel-info">
                <label>key facts</label>
                <div className="info-ans">
                  {artist.key_facts
                    ? <div>{artist.keyfacts}</div>
                    :
                    <div className="bg-content yellow w-custom-bg-content">
                      It looks like there are no a key facts for <span
                      className="artist-name">Jetty Rae</span> yet. <NavLink
                      to="/profile/edit">Tell us a bit</NavLink>, we'd love to know more!
                    </div>
                  }
                </div>
              </div>
              <div className="parallel-info social">
                <label>Social Links</label>
                <div className="info-ans">
                  {!artist.social.length && '-'}
                  {artist.social.map((link, key) => {
                    return (
                      link
                        ?
                        <p key={key}>{link.replace("https://","").split('/')[0].replace("https://","")+"/"}<a href={link.includes("https://") ? link : "https://"+link} target="_blank">{link.split("/")[link.split("/").length-1]}</a></p>
                        : ''
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          }
        </div>
      </section>
      <section className="artist-section-control contact">
        <div className="section-content">
          <div className="section-head">
            <h2>Contact</h2>
            <NavLink to="/profile/edit" className="btn primary-btn">Edit</NavLink>
          </div>
          <div className="section-body">
            <div className="parallel-info">
              <label>address</label>
              <div className="info-ans">
                {artist.contact
                  ?
                  <span>{artist.contact}</span>
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile;