import React, {useEffect, useRef, useState} from "react";
import "./Profile.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import Loader from "../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {
  ACCESS_TOKEN,
  ARTIST_PROFILE_UPDATE,
  BASE_URL,
  COLLABORATOR_ARTIST_PROFILE_UPDATE, LIST_GENRES, PRO_LIST
} from "../../../../common/api";
import DropzoneComponent from "../../../../common/Dropzone/DropzoneComponent";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notes from "../../../../common/Notes/Notes";
import Notiflix from "notiflix";
import csc from "country-state-city";
import Select from "react-select";

function ProfileEdit() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);
  const [bioLimitFlag, setBioLimitFlag] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [image, setImage] = useState([]);
  const countryRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [profileImageError, setProfileImageError] = useState(false);
  const [bannerImageError, setBannerImageError] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [pro, setPro] = useState(null);
  const [proError, setProError] = useState(false);
  const [otherError, setOtherError] = useState(false);
  const [ipiFlag, setIpiFlag] = useState(false);

  useEffect(() => {
    prepareCountriesList();
    if(artistState.artist) {
      setIsLoading(false);
      if(Object.keys(artistState.artist).length <= 1) {
        Notiflix.Report.failure( 'Not accessible', `You don't have access to profile!`, 'Ok', () => {
          history.push("/");
        } );
      }
      setArtist(artistState.artist);
      setPro(artistState.artist.pro);
      setSelectedCountry(artistState.artist.country || null);
      fetchGenres();
    } else
      setIsLoading(true);
  }, [artistState.artist])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      const data = new FormData(form.current);
      let errors = false;
      setEmailError(false);
      setProfileImageError(false);
      setBannerImageError(false);
      setOtherError(false);
      if(!selectedCountry) {
        Notiflix.Notify.failure('Country is required!', {
          timeout: 6000000,
          clickToClose: true,
        });
        setCountryError(true);
        errors = true;
      }
      if(data.get('email')) {
        if(!handleEmailValidate(data.get('email')))
          Notiflix.Notify.failure('A valid email address is required!', {
            timeout: 6000000,
            clickToClose: true,
          });
      } else {
        Notiflix.Notify.failure('A valid email address is required!', {
          timeout: 6000000,
          clickToClose: true,
        });
        setEmailError(true);
        errors = true;
      }
      if(pro) {
        if(pro === 'other') {
          if(!data.get('pro')) {
            setOtherError(true);
            Notiflix.Notify.failure('PRO is required!', {
              timeout: 6000000,
              clickToClose: true,
            });
            errors = true;
          }
        } else {
          data.append('pro', pro);
        }
        if(pro.toLowerCase() !== 'ns' && !handleIPICharacterLimit(data.get('ipi'))) {
          Notiflix.Notify.failure('A valid CAE/IPI # is required!', {
            timeout: 6000000,
            clickToClose: true,
          });
          errors = true;
        }
      }
      else {
        setProError(true);
        Notiflix.Notify.failure('PRO is required!', {
          timeout: 6000000,
          clickToClose: true,
        });
        errors = true;
      }

      if(!profileImage && !artist.profile_image ) {
        Notiflix.Notify.failure('Profile image is required!', {
          timeout: 6000000,
          clickToClose: true,
        });
        setProfileImageError(true);
        errors = true;
      }
      if(!bannerImage && !artist.banner_image) {
        Notiflix.Notify.failure('Banner image is required!', {
          timeout: 6000000,
          clickToClose: true,
        });
        setBannerImageError(true);
        errors = true;
      }
      if(errors)
        return false;
      if(!handleBioCharacterChange(data.get('bio')))
        return false;
      setIsLoading(true);
      data.append('country', selectedCountry);
      if(!profileImage)
        data.delete('profile_image')
      if(!bannerImage)
        data.delete('banner_image')
      if(image.length) {
        for(let i = 0; i < image.length; i++)
          data.append('additional_images[]', image[i]);
      }
      if(selectedGenres.length > 0) {
        for(let i = 0; i < selectedGenres.length; i++)
           if (selectedGenres[i] !== undefined) {
            data.append('genre_ids[]', selectedGenres[i].value);
          }
      } else {
        data.append('genre_ids[]', []);
      }
      data.delete('name');
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      let artist_id =  userRole === "collaborator" && artistState.selectedArtist && artistState.selectedArtist.id;
      let url = `${BASE_URL}${ARTIST_PROFILE_UPDATE}`;
      if(userRole === "collaborator") {
        artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
        url = `${BASE_URL}${COLLABORATOR_ARTIST_PROFILE_UPDATE}?artist_id=${artist_id}`
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: 'PATCH',
          body: data
        });
      const artistData = await response.json();
      if(!response.ok) {
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000000,
          clickToClose: true,
        });
      } else {
        setArtist(artistData);
        artistActions.artistStateChanged(artistData);
        Notiflix.Notify.success('Profile updated!');
        history.push('/profile');
      }
      setIsLoading(false);
    }
  }

  const handleBioCharacterChange = (value) => {
    setBioLimitFlag(false);
    if(value.length > 400) {
      setBioLimitFlag(true);
      return false;
    } else
      return true
  }

  const handleUploadImages = (images) => {
    setImage(images);
  }

  const handleUploadProfileImage = (e) => {
    let img = e.target.files[0];
    let reader = new FileReader();
    //Read the contents of Image File.
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      //Initiate the JavaScript Image object.
      let image = new Image();
      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;
      //Validate the File Height and Width.
      image.onload = function () {
        let height = this.height;
        let width = this.width;
        if (width < 353 || height < 353) {
          Notiflix.Report.warning( 'Upload failed', `Profile Image must be min 353px x 353px\nUploaded image is ${width}px x ${height}!`, 'Ok' );
          return false;
        } else {
          setProfileImage(img)
          setProfileImageError(false);
          return true;
        }
      };
    };
  }

  const handleUploadBannerImage = (e) => {
    let img = e.target.files[0];
    let reader = new FileReader();
    //Read the contents of Image File.
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      //Initiate the JavaScript Image object.
      let image = new Image();
      //Set the Base64 string return from FileReader as source.
      image.src = e.target.result;
      //Validate the File Height and Width.
      image.onload = function () {
        let height = this.height;
        let width = this.width;
        if (width < 1440 || height < 448) {
          Notiflix.Report.warning( 'Upload failed', `Banner Image must be min 1440px x 448px\nUploaded image is ${width}px x ${height}!`, 'Ok' );
          return false;
        } else {
          setBannerImage(img)
          setBannerImageError(false);
          return true;
        }
      };
    };
  }

  const prepareCountriesList = () => {
    const countries = csc.getAllCountries();
    const list = [];
    list.push({label: "Select Country", value: null, countryCode: null});
    list.push({label: "United States", value: "United States", countryCode: "US"});
    countries.forEach((country, key) => {
      if(country.isoCode !== 'US')
        list.push({label: country.name, value: country.name, countryCode: country.isoCode})
    });
    setCountriesList(list);
    artistActions.countriesStateChanged(list);
  }

  const handleCountrySelection = (target) => {
    if(target.value)
      setCountryError(false);
    setSelectedCountry(target.value);
  }

  function handleEmailValidate(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email).toLowerCase())) {
      setEmailError(false);
      return true
    } else {
      setEmailError(true);
      return false;
    }
  }

  const fetchGenres = async () => {
    const response = await fetch(`${BASE_URL}${LIST_GENRES}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN
        }
      });
    const resultSet = await response.json();
    if(response.status !== 200) {
      setGenres([]);
    } else {
      let tmp = [];
      let selectedTmp = [];
      for (let i = 0; i < resultSet.length; i++) {
        tmp.push({label: resultSet[i].name, value: resultSet[i].id});
        selectedTmp[resultSet[i].id] = {label: resultSet[i].name, value: resultSet[i].id};
      }
      setGenres(tmp);
      setSelectedGenres(artistState.artist.genres.map((genre) => {return selectedTmp[genre.id]}))
    }
  }

  const handleGenreSelection = (target) => {
    setSelectedGenres(target);
  }

  const handleIPICharacterLimit = (value) => {
    setIpiFlag(false);
    if(value.length === 9) {
      setIpiFlag(false);
      return true;
    } else {
      setIpiFlag(true);
      return false;
    }
  }

  return (
    <div className="artist-wrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/profile">Profile</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Edit Profile
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Profile</h2>
          </div>
          <div className="section-body">
            <div className="w-custom-percent">
              {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
              {Object.keys(artist).length !== 0 &&
                <Form noValidate validated={validated} ref={form}>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Artist Name</Form.Label>
                    </Col>
                    <Col xl={4} md={8} className="artist-name-bonding">
                      <Form.Control
                        readOnly={true}
                        name="name"
                        value={artist.name}
                        type="text"
                      />
                      {!isLoading &&
                      <Notes
                        role={artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "")}
                        artist_id={artistState.selectedArtist ? artistState.selectedArtist.id : null}
                        title={artist.name}
                        type={"ArtistProfile"}
                        id={artist.id}
                        tooltipPosition="top"
                        tooltipText="Add a note here to request changes"
                      />
                    }
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Email*</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="email"
                        defaultValue={artist.email || ""}
                        type="email"
                        placeholder="Your band's email address"
                        className={emailError ? "invalid" : ""}
                        onChange={(e) => handleEmailValidate(e.target.value)}
                      />
                      {emailError &&
                      <small className="error">
                        A valid email address is required!
                      </small>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Country*</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Select
                        ref={countryRef}
                        placeholder="Select Country"
                        className="country-select-container-header"
                        classNamePrefix={!countryError ? "country-select-header" : "country-select-header invalid"}
                        options={countriesList}
                        defaultValue={selectedCountry ? countriesList.filter(option => option.value === selectedCountry) : {label: "Select Country", value: null}}
                        onChange={handleCountrySelection}
                        noOptionsMessage={() => {return "No country found"}}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                      {countryError &&
                      <small className="error">
                        Country is required!
                      </small>
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>PRO*</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Select
                        placeholder="Select PRO"
                        className="pro-select-container-header"
                        classNamePrefix={!proError ? "pro-select-header react-select-popup" : "pro-select-header react-select-popup invalid"}
                        options={PRO_LIST}
                        defaultValue={artist.pro ? PRO_LIST.filter(item => item.value === artist.pro).length === 0 ? {label: "Other", value: 'other'} : PRO_LIST.filter(item => item.value === artist.pro) : {label: "Select PRO", value: null}}
                        onChange={(target) => {setProError(false);setPro(target.value)}}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                      {proError &&
                      <small className="error">
                        PRO is required!
                      </small>
                      }
                      <small><strong>Note:</strong> if you're not registered with a PRO, please select NS from the dropdown (no society)</small>
                    </Col>
                  </Row>
                  {pro && (pro === 'other' || PRO_LIST.filter(item => item.value === pro).length === 0) &&
                    <Row>
                      <Col xl={2} md={4}>
                        <Form.Label></Form.Label>
                      </Col>
                      <Col xl={4} md={8}>
                        <Form.Control
                          required
                          name="pro"
                          defaultValue={artist.pro || ""}
                          type="text"
                          className={otherError ? "invalid" : ""}
                          placeholder="Enter your PRO name"
                        />
                        {otherError &&
                        <small className="error">
                          PRO name is required!
                        </small>
                        }
                      </Col>
                    </Row>
                  }
                  {pro && pro.toLowerCase() !== 'ns' &&
                    <Row>
                      <Col xl={2} md={4}>
                        <Form.Label>CAE/IPI #*</Form.Label>
                      </Col>
                      <Col xl={4} md={8}>
                        <Form.Control
                          required
                          name="ipi"
                          type="number"
                          defaultValue={artist.ipi || ''}
                          placeholder="CAE/IPI #*"
                          onChange={(e) => handleIPICharacterLimit(e.target.value)}
                          className={ipiFlag ? "invalid" : ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          CAE/IPI # is required!
                        </Form.Control.Feedback>
                        {ipiFlag && <div className="custom-invalid-feedback">CAE/IPI # must be 9 digits</div>}
                        <div>
                          <small className="text-muted">
                            <strong>Note</strong>: An CAE/IPI # is not the same as a member number, its the 9 digit number
                            that appears on the statements from your PRO
                          </small>
                        </div>
                      </Col>
                    </Row>
                  }
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Profile Image*</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.File
                        accept=".png, .jpg, .svg"
                        onChange={(e) => {handleUploadProfileImage(e)}}
                        name="profile_image"
                        label={profileImage ? profileImage.name : artist.profile_image ? artist.profile_image.split('/')[artist.profile_image.split("/").length-1] : ""}
                        lang="en"
                        custom
                      />
                      <small className="info-text"><i>Minimum required size for profile image is 353px x 353px</i></small>
                      {profileImageError &&
                      <small className="error">
                        Profile image is required!
                      </small>
                      }
                      <img className="preview" src={profileImage ? URL.createObjectURL(profileImage) : artist.profile_image}></img>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Banner Image*</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.File
                        accept=".png, .jpg, .svg"
                        onChange={(e) => {handleUploadBannerImage(e)}}
                        name="banner_image"
                        label={bannerImage ? bannerImage.name : artist.banner_image ? artist.banner_image.split('/')[artist.banner_image.split("/").length-1] : ""}
                        lang="en"
                        custom
                      />
                      <small className="info-text"><i>Minimum required size for banner image is 1440px x 448px - please do not include images with any text. Images with text will be rejected.</i></small>
                      {bannerImageError &&
                      <small className="error">
                        Banner image is required!
                      </small>
                      }
                      <img className="preview" src={bannerImage ? URL.createObjectURL(bannerImage) : artist.banner_image}></img>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Additional Images</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <DropzoneComponent uploadedFiles={artist.additional_images ?? []} onUploadImages={handleUploadImages} />
                    </Col>
                  </Row>
                  <div className="parallel-info row">
                    <Col xl={2} md={4}>
                    </Col>
                    <Col xl={10} md={8}>
                      <div className="info-ans additional-elements image">
                        {artist.additional_images &&
                          artist.additional_images.map((image, key) => {
                            return (
                              <img key={key} className="additional-image" src={image} alt="Image" />
                            )
                          })
                        }
                      </div>
                    </Col>
                  </div>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Sounds Like</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="sounds_like"
                        defaultValue={artist.sounds_like}
                        type="text"
                        placeholder="Fats Domino, Trombone Shorty, Irina thomas"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Genres</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Group className="form-group-inline">
                        <Select
                          isMulti
                          placeholder="Select Genre"
                          className="genre-select-container-header"
                          classNamePrefix={"genre-select-header"}
                          options={genres}
                          onChange={handleGenreSelection}
                          value={selectedGenres}
                          noOptionsMessage={() => {return "No genre found"}}
                          theme={theme => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: '#c0d72d',
                            },
                          })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Bio</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="bio"
                        defaultValue={artist.bio}
                        placeholder="Write bio here"
                        as="textarea"
                        rows={4}
                        onChange={(e) => handleBioCharacterChange(e.target.value)}
                        className={bioLimitFlag ? 'invalid' : ''}
                      />
                      {bioLimitFlag && <div className="custom-invalid-feedback">Max of 400 characters allowed!</div> }
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Key Facts</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="key_facts"
                        defaultValue={artist.key_facts}
                        rows={4}
                        as="textarea"
                        placeholder="Key Facts"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>TikTok Link</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="tiktok"
                        defaultValue={artist.social ? artist.social.tiktok || "" : ""}
                        type="text"
                        placeholder="TikTok Link"
                        className="mb-1"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Twitter Link</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="twitter"
                        defaultValue={artist.social ? artist.social.twitter || "" : ""}
                        type="text"
                        placeholder="Twitter Link"
                        className="mb-1"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Facebook Link</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="facebook"
                        defaultValue={artist.social ? artist.social.facebook || "" : ""}
                        type="text"
                        placeholder="Facebook Link"
                        className="mb-1"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Instagram Link</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="instagram"
                        defaultValue={artist.social ? artist.social.instagram || "" : ""}
                        type="text"
                        placeholder="Instagram Link"
                        className="mb-1"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={2} md={4}>
                      <Form.Label>Website link</Form.Label>
                    </Col>
                    <Col xl={4} md={8}>
                      <Form.Control
                        name="website_link"
                        defaultValue={artist.website_link ? artist.website_link || "" : ""}
                        type="text"
                        placeholder="Website link"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-5">
                    <Col xl={2} md={4}></Col>
                    <Col xl={4} md={8} className="text-center">
                      <NavLink to="/profile" className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
                      <Button onClick={handleSubmit} className="btn primary-btn submit">{isLoading ? <>Saving...<img className="" src={Loader} alt="icon"/></> : "Save" }</Button>
                    </Col>
                  </Row>
                </Form>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileEdit;