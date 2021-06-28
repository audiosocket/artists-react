import React, {useEffect, useState} from "react";
import "./Profile.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import Loader from "../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notiflix from "notiflix-react";
import ArrowRight from "../../../../images/right-arrow.svg";
import Waiting from "../../../../images/waiting.svg";
import Check from "../../../../images/check-solid.svg";
import Cancel from "../../../../images/close-circle-2.svg";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function Profile() {
  const {artistState} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();

  useEffect(() => {
    if(artistState.artist) {
      setIsLoading(false);
      if(Object.keys(artistState.artist).length <= 1) {
        Notiflix.Report.Failure( 'Not accessible', `You don't have access to profile!`, 'Ok', () => {
          history.push("/");
        } );
      }
      setArtist(artistState.artist);
    } else
      setIsLoading(true);
  }, [artistState.artist])

  const handleNext = () => {
    if(artist) {
      if(!artist.contact_information || !artist.payment_information || !artist.tax_information) {
        Notiflix.Notify.Failure('You must complete artist profile to unlock Partners page');
      }
    }
  }

  return (
    <div className="artist-wrapper">
      <div className="next-btn">
        <NavLink onClick={handleNext} to={(!artist.contact_information || !artist.payment_information || !artist.tax_information) ? "/profile" : "partners"} className="btn primary-btn next">Next <img className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
      </div>
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Profile
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Profile</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink to="/profile/edit" className="btn primary-btn">Edit</NavLink>
            }
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
          <div className="section-body">
            <div className="w-custom-percent">
              <div className="parallel-info">
                <label>name</label>
                <div className="info-ans">{artist.name}</div>
              </div>

              <div className="parallel-info">
                <label>
                  cover image
                  {artist.cover_image &&
                    <OverlayTrigger placement={"top"} overlay={<Tooltip id="tooltip-right">{artist.cover_image_status === "approved" ? "Your cover image has been approved" : artist.cover_image_status === "pending" ? "Your cover image is under review" : "Your cover image has been rejected"}</Tooltip>}>
                      {artist.cover_image_status === "approved"
                        ? <img src={Check} alt="approved"/>
                        : artist.cover_image_status === "pending" ? <img src={Waiting} alt="pending"/> : <img src={Cancel} alt="cancel"/>
                      }
                    </OverlayTrigger>
                  }
                </label>
                <div className="info-ans image">
                  {artist.cover_image
                    ? <img className="preview" src={artist.cover_image} alt="Cover Image"/>
                    : <div className="bg-content yellow w-custom-bg-content">
                      Looks like no cover image? Click <i className="medium-text">Edit</i> button to get started.
                    </div>
                  }
                </div>
              </div>
              <div className="parallel-info">
                <label>
                  Banner image
                  {artist.banner_image &&
                  <OverlayTrigger placement={"top"} overlay={<Tooltip id="tooltip-right">{artist.banner_image_status === "approved" ? "Your banner image has been approved" : artist.banner_image_status === "pending" ? "Your banner image is under review" : "Your banner image has been rejected"}</Tooltip>}>
                    {artist.banner_image_status === "approved"
                      ? <img src={Check} alt="approved"/>
                      : artist.banner_image_status === "pending" ? <img src={Waiting} alt="pending"/> : <img src={Cancel} alt="cancel"/>
                    }
                  </OverlayTrigger>
                  }
                </label>
                <div className="info-ans image">
                  {artist.banner_image
                    ? <img src={artist.banner_image} alt="Banner Image" />
                    : <div className="bg-content yellow w-custom-bg-content">
                      Wants to add a banner image? Click <i className="medium-text">Edit</i> button to get started.
                    </div>
                  }
                </div>
              </div>
              <div className="parallel-info">
                <label>additional images</label>
                <div className="info-ans additional-elements image">
                  {!artist.additional_images
                    ?
                    <div className="bg-content yellow w-custom-bg-content">
                      Have additional images for us? <NavLink to="/profile/edit">Upload them here</NavLink> for <span
                      className="artist-name">{artist.name}</span>.
                    </div>
                    :
                    artist.additional_images.map((image, key) => {
                      return (
                          <img key={key} className="additional-image" src={image} alt="Image" />
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
                    ? <div>{artist.key_facts}</div>
                    :
                    <div className="bg-content yellow w-custom-bg-content">
                      It looks like there are no a key facts for <span
                      className="artist-name">"{artist.name}"</span> yet. <NavLink
                      to="/profile/edit">Tell us a bit</NavLink>, we'd love to know more!
                    </div>
                  }
                </div>
              </div>
              <div className="parallel-info social">
                <label>Social Links</label>
                <div className="info-ans">
                  {!artist.social && '-'}
                  {artist.social && artist.social.map((link, key) => {
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
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink to="/profile/contact/edit" className="btn primary-btn">Edit</NavLink>
            }
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading contact... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="section-body">
            <div className="parallel-info">
              <label>address</label>
              <div className="info-ans">
                {artist.contact_information
                  ?
                  <>
                    <span>{artist.contact_information.name}</span>
                    <span>{artist.contact_information.postal_code}, {artist.contact_information.street}</span>
                    <span>{artist.contact_information.city}, {artist.contact_information.state}</span>
                    <span>{artist.contact_information.country}</span>
                    {artist.contact_information.phone &&
                      <span><small className="medium-text">Phone#: </small>{artist.contact_information.phone}</span>
                    }
                  </>
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="artist-section-control contact">
        <div className="section-content">
          <div className="section-head">
            <h2>Payment</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink to="/profile/payment/edit" className="btn primary-btn">Edit</NavLink>
            }
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading payment... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="section-body">
            <div className="parallel-info">
              <label>Payment Details</label>
              <div className="info-ans">
                {artist.payment_information
                  ?
                  <>
                    <span><small className="medium-text">Payee: </small>{artist.payment_information.payee_name}</span>
                    <span><small className="medium-text">Bank: </small>{artist.payment_information.bank_name}</span>
                    <span><small className="medium-text">Routing: </small>{artist.payment_information.routing}</span>
                    <span><small className="medium-text">Account#: </small>{artist.payment_information.account_number}</span>
                    {artist.contact_information && artist.contact_information.country.toLowerCase() !== 'united states' &&
                      <span><small className="medium-text">Paypal Email: </small>{artist.payment_information.paypal_email}</span>
                    }
                  </>
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="artist-section-control contact">
        <div className="section-content">
          <div className="section-head">
            <h2>Tax</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink to="/profile/tax/edit" className="btn primary-btn">Edit</NavLink>
            }
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading tax... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="section-body">
            <div className="parallel-info">
              <label>ID/Social Security Number</label>
              <div className="info-ans">
                {artist.tax_information
                  ? <span>{artist.tax_information.ssn}</span>
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