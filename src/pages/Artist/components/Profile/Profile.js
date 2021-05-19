import React, {useEffect, useState} from "react";
import "./Profile.scss";
import cover from '../../../../images/artist-cover.jpg';
import banner from '../../../../images/artist-banner.jpg';
import {ArtistContext} from "../../../../Store/artistContext";
import fetchArtist from "../../../../common/utlis/fetchArtist";
import Loader from "../../../../images/loader.svg";

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
            <a href="" className="btn primary-btn">Edit</a>
          </div>
          {isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length &&
            <div className="section-body">
              <div className="w-custom-percent">
                <div className="parallel-info">
                  <label>name</label>
                  <div className="info-ans">{artist.name}</div>
                </div>

                <div className="parallel-info">
                  <label>cover image</label>
                  <div className="info-ans">
                    <img src={artist.cover_image ? artist.cover_image : cover} alt="Cover Image" className=""/>
                  </div>
                </div>

                <div className="parallel-info">
                  <label>banner image</label>
                  <div className="info-ans">
                    <img src={artist.banner_image ? artist.banner_image :banner} alt="Banner Image" className=""/>
                  </div>
                </div>

                <div className="parallel-info">
                  <label>additional images</label>
                  {!artist.additional_images
                    ?
                    <div className="info-ans">
                      <div className="bg-content yellow">
                        Have additional images for us? <a href="">Upload them here</a> for <span
                        classname="artist-name">Jetty Rae</span>
                      </div>
                    </div>
                    :
                    <img src={artist.cover_image ? artist.cover_image : cover} alt="Cover Image" className=""/>
                  }
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
                      <div className="bg-content yellow">
                        It looks like there are no a key facts for <span
                        className="artist-name">Jetty Rae</span> yet. <a
                        href="">Tell us a bit</a>, we'd love to know more!
                      </div>
                    }
                  </div>
                </div>

                <div className="parallel-info social">
                  <label>Social</label>
                  <div className="info-ans">
                    {!artist.social.length && '-'}
                    {artist.social.map((link, key) => {
                      return (
                          <p key={key}><a href={link} target="_blank">{link}</a></p>
                        )
                      })
                    }
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
            <a href="" className="btn primary-btn">Edit</a>
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