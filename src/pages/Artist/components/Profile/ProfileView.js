import React, {useEffect, useState} from "react";
import "./Profile.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import Loader from "../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notiflix from "notiflix";
import ArrowRight from "../../../../images/right-arrow.svg";
import Waiting from "../../../../images/waiting.svg";
import Check from "../../../../images/check-solid.svg";
import Cancel from "../../../../images/close-circle-2.svg";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {ACCESS_TOKEN, BASE_URL, COLLABORATOR_CREATE_TAX_FORM, CREATE_TAX_FORM} from "../../../../common/api";

function Profile() {
  const {artistState} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const [taxForm, setTaxForm] = useState(null);
  const [taxFormLoading, setTaxFormLoading] = useState(false);

  useEffect(() => {
    if(artistState.artist) {
      setIsLoading(false);
      if(Object.keys(artistState.artist).length <= 1) {
        Notiflix.Report.failure( 'Not accessible', `You don't have access to profile!`, 'Ok', () => {
          history.push("/");
        } );
      }
      setArtist(artistState.artist);
    } else
      setIsLoading(true);
  }, [artistState.artist])

  const handleNext = () => {
    if(artist) {
      if(!artist.banner_image || !artist.profile_image || !artist.contact_information) {
        Notiflix.Notify.failure('You must complete artist profile to unlock Partners page', {
          timeout: 6000000,
          clickToClose: true,
        });
      }
    }
  }

  const handleCheckContact = () => {
    if(!artist.contact_information) {
      Notiflix.Report.warning('Action required', 'Please complete your contact information first!', 'Update Profile', () => {
        history.push('/profile/contact/edit')
      });
    }
  }

  const fetchTaxForm = async () => {
    if(artistState.artist && !artistState.artist.contact_information) {
      Notiflix.Report.warning('Action required', 'Please complete your contact information first!', 'Update Profile', () => {
        history.push('/profile/contact/edit')
      });
      return false;
    }
    setTaxFormLoading(true);
    const userRole = JSON.parse(localStorage.getItem("userRole") ?? "");
    const artist_id = artistState.selectedArtist ? artistState.selectedArtist.id : null;
    const url = userRole === 'collaborator' ? `${BASE_URL}${COLLABORATOR_CREATE_TAX_FORM}?artist_id=${artist_id}` : `${BASE_URL}${CREATE_TAX_FORM}`
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const response = await fetch(url,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        },
        method: "POST"
      });
    const resultSet = await response.json();
    if (!response.ok) {
      Notiflix.Notify.failure('System has encountered an error while fetching tax form, try later!', {
        timeout: 6000000,
        clickToClose: true,
      });
    } else {
      setTaxForm(resultSet.url || null);
      if(resultSet.url)
        window.open(resultSet.url, '_blank');
    }
    setTaxFormLoading(false);
  }

  return (
    <div className="artist-wrapper">
      <div className="next-btn">
        <NavLink onClick={handleNext} to={(!artist.banner_image || !artist.profile_image || !artist.contact_information) ? "/profile" : "partners"} className="btn primary-btn next">Next <img className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
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
                <label>Email</label>
                <div className="info-ans">{artist.email || '-'}</div>
              </div>
              <div className="parallel-info">
                <label>country</label>
                <div className="info-ans">{artist.country || '-'}</div>
              </div>
              <div className="parallel-info">
                <label>PRO</label>
                <div className="info-ans">{artist.pro || '-'}</div>
              </div>
              {artist.pro && artist.pro.toLowerCase() !== 'ns' &&
                <div className="parallel-info">
                  <label>CAE/IPI #</label>
                  <div className="info-ans">{artist.ipi || '-'}</div>
                </div>
              }
              <div className="parallel-info">
                <label>
                  Profile image
                  {artist.profile_image &&
                    <OverlayTrigger placement={"top"} overlay={<Tooltip id="tooltip-right">{artist.profile_image_status === "approved" ? "Your profile image has been approved" : artist.profile_image_status === "pending" ? "Your profile image is under review" : "Your profile image has been rejected"}</Tooltip>}>
                      {artist.profile_image_status === "approved"
                        ? <img src={Check} alt="approved"/>
                        : artist.profile_image_status === "pending" ? <img src={Waiting} alt="pending"/> : <img src={Cancel} alt="cancel"/>
                      }
                    </OverlayTrigger>
                  }
                </label>
                <div className="info-ans image">
                  {artist.profile_image
                    ? <img className="preview" src={artist.profile_image} alt="Profile Image"/>
                    : <div className="bg-content yellow w-custom-bg-content">
                      Looks like no profile image? Click <i className="medium-text">Edit</i> button to get started.
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
                <label>Genres</label>
                <div className="info-ans genres">
                  {artist.genres.length > 0
                    ? artist.genres.map((genre) => { return <span className="genre">{genre.name}</span>})
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
              <div className="info-ans">
                {!artist.social && '-'}
                {artist.social && Object.values(artist.social).map((link, key) => {
                  return (
                    link && link.trim().length > 0
                      ?
                      <div className="parallel-info social"><label>{key == 0 ? "Tiktok" : key == 1 ? "Twitter" : key == 2 ? "Facebook" : key == 3 ? "Instagram" : ""} Link</label>
                      <p key={key}><a rel="noreferrer" href={link.includes("https://") ? link : "https://"+link} target="_blank">{link}</a></p></div>
                      : <div className="parallel-info social"><label>{key == 0 ? "Tiktok" : key == 1 ? "Twitter" : key == 2 ? "Facebook" : key == 3 ? "Instagram" : ""} Link</label>-</div>
                  )
                })}
              </div>
              <div className="parallel-info">
                <label>Website link</label>
                <div className="info-ans">
                  {artist.website_link
                    ? <p><a rel="noreferrer" href={artist.website_link.includes("https://") ? artist.website_link : "https://"+artist.website_link} target="_blank">{artist.website_link}</a></p>
                    : '-'
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
                    <span><a href={"tel:"+artist.contact_information.phone}>{artist.contact_information.phone}</a></span>
                    <span><a href={"mailto:"+artist.contact_information.email}>{artist.contact_information.email}</a></span>
                  </>
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="artist-section-control contact">
        <div className="bg-content yellow">
          <div className='sub-section'>
            <h4><strong>Getting Paid</strong></h4>
            <p>Please make sure that you have completely and correctly filled in your payment information.We offer one payee per artist entity.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>US citizens</strong></h4>
            <p>Please complete a W9 for your artist entity using the link below. The payee on the W9 must match the bank information payee.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>International artists</strong></h4>
            <p>Please complete a W8 form using the link below.</p>
          </div>
        </div>
        {JSON.parse(localStorage.getItem("userRole")) !== "collaborator" && <div className="section-content">
          <div className="section-head">
            <h2>Payment</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <NavLink onClick={handleCheckContact} to={artist.contact_information ? "/profile/payment/edit" : "/profile"} className="btn primary-btn">Edit</NavLink>
            }
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading payment... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="section-body">
            <div className="parallel-info">
              <label>Payment Details</label>
              <div className="info-ans">
                {artist.payment_information && artist.contact_information
                  ?
                  <>
                    {artist.contact_information.country && artist.payment_information.account_number && artist.contact_information.country.toLowerCase() === 'united states' &&
                      <>
                        <span><small className="medium-text">Payee: </small>{artist.payment_information.payee_name}</span>
                        <span><small className="medium-text">Bank: </small>{artist.payment_information.bank_name}</span>
                        <span><small className="medium-text">Routing: </small>{artist.payment_information.routing}</span>
                        <span><small className="medium-text">Account#: </small>xxxxxx{artist.payment_information.account_number.substr(-4)}</span>
                      </>
                    }
                    {artist.contact_information.country && artist.contact_information.country.toLowerCase() !== 'united states' &&
                      <span><small className="medium-text">Paypal Email: </small><a href={"mailto:"+artist.payment_information.paypal_email}>{artist.payment_information.paypal_email}</a></span>
                    }
                  </>
                  : '-'
                }
              </div>
            </div>
          </div>
        </div>
        }
      </section>
      { JSON.parse(localStorage.getItem("userRole")) !== "collaborator" && <section className="artist-section-control contact">
        <div className="section-content">
          <div className="section-head">
            <h2>Tax</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading tax... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          <div className="section-body">
            {artist.tax_information &&
              artist.tax_information.tax_forms.map((form, key) => {
                return (
                  <div key={key} className="parallel-info">
                    <label>Submission</label>
                    <div className="info-ans">
                      <a className="tax-form-link" href={form} target="_blank">Preview</a>
                    </div>
                  </div>
                )
              })
            }
            <div className="parallel-info">
              <label></label>
              <div className="info-ans">
                {!taxForm && taxFormLoading
                  ? <span>Fetching tax form... <img className="loading tax-form" src={Loader} alt="loading-icon"/></span>
                  : <a className="tax-form-link" onClick={fetchTaxForm}>{'Fill W8/W9 form here'}</a>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      }
    </div>
  )
}

export default Profile;