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
  COLLABORATOR_ARTIST_PROFILE_UPDATE
} from "../../../../common/api";
import csc from 'country-state-city'
import Select from 'react-select'
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Notiflix from "notiflix";

function ContactEdit() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const history = useHistory();
  const form = useRef(null);
  const [validated, setValidated] = useState(false);

  const countryRef = useRef(null)
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryError, setCountryError] = useState(false);

  const stateRef = useRef(null)
  const [statesList, setStatesList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [stateError, setStateError] = useState(false);

  const cityRef = useRef(null)
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityError, setCityError] = useState(false);

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

    prepareCountriesList();

    // if(!artistState.countries) {
    //   prepareCountriesList();
    // }
    // else {
    //   setCountriesList(artistState.countries)
    // }
    if(artistState.countries && artistState.artist.contact_information) {
      let states = prepareStatesDropdown();
      let cities = prepareCitiesDropdown();
      setSelectedCountry(artistState.artist.contact_information.country)
      setSelectedState(artistState.artist.contact_information.state)
      setSelectedCity(artistState.artist.contact_information.city)
      if(form.current) {
        countryRef.current.select.setValue(artistState.countries.filter((country) => country.value === artistState.artist.contact_information.country)[0])
        stateRef.current.select.setValue(states.filter((state) => state.value === artistState.artist.contact_information.state)[0])
        cityRef.current.select.setValue(cities.filter((city) => city.value === artistState.artist.contact_information.city)[0])
      }
    }
    if(artistState.artist && !artistState.artist.contact_information && form.current) {
      form.current.reset();
      countryRef.current.select.setValue({label: "Select Country", value: null, key: null});
      stateRef.current.select.setValue({label: "Select State/County", value: null, countryCode: null});
      cityRef.current.select.setValue({label: "Select State/County", value: null, countryCode: null});
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
    }

  }, [artistState.artist])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistForm = e.currentTarget;
    if(!selectedCountry)
      setCountryError(true);
    if(!selectedState)
      setStateError(true);
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      if(!selectedCountry || !selectedState)
        return false;
      setIsLoading(true);
      const data = new FormData(form.current);
      const json = prepareJson(data);
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
            "auth-token": userAuthToken,
            'content-type': 'application/json',
          },
          method: 'PATCH',
          body: json
        });
      const artist = await response.json();
      if(!response.ok) {
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000000,
          clickToClose: true,
        });
      } else {
        setArtist(artist);
        artistActions.artistStateChanged(artist);
        Notiflix.Notify.success('Contact information updated!');
        history.push('/profile');
      }
      setIsLoading(false);
    }
  }

  const prepareJson = (data) => {
    let object = {};
    data.forEach((value, key) => object[key] = value);
    object["name"] = data.get('name');
    object["street"] = data.get('street');
    object["postal_code"] = data.get('postal_code');
    object["city"] = selectedCity;
    object["state"] = selectedState;
    object["country"] = selectedCountry;
    object = {
      contact_information: object
    }
    let json = JSON.stringify(object);
    return json;
  }

  const prepareCountriesList = () => {
    const countries = csc.getAllCountries();
    const list = [];
    list.push({label: "Select Country", value: null, countryCode: null});
    list.push({label: "United States", value: "United States", countryCode: "US"});

    countries.forEach((country, key) => {
      const availableStates = csc.getStatesOfCountry(country.isoCode)
      if (availableStates.length > 0 && country.isoCode !== 'US' && country.isoCode !== 'XK') {
        list.push({label: country.name, value: country.name, countryCode: country.isoCode})
      }
    });
    setCountriesList(list);
    artistActions.countriesStateChanged(list);
  }

  const prepareStatesDropdown = () => {
    const filteredCountry = artistState.countries.filter(option => option.value === artistState.artist.contact_information.country);
    const states = csc.getStatesOfCountry(filteredCountry[0].countryCode)
    const list = []
    list.push({label: "Select State/County", value: null, countryCode: null});
    states.forEach((state, key) => {
      list.push({label: state.name, value: state.name, countryCode: state.countryCode, stateCode: state.isoCode})
    });
    setStatesList(list);
    return list;
  }

  const prepareCitiesDropdown = () => {
    const filteredCountry = artistState.countries.filter(option => option.value === artistState.artist.contact_information.country);
    const states = csc.getStatesOfCountry(filteredCountry[0].countryCode)
    const tempStateList = []
    tempStateList.push({label: "Select State/County", value: null, countryCode: null});
    states.forEach((state, key) => {
      tempStateList.push({label: state.name, value: state.name, countryCode: state.countryCode, stateCode: state.isoCode})
    });

    const filteredState = tempStateList.filter(option => option.value === artistState.artist.contact_information.state);
    const cities = csc.getCitiesOfState(filteredState[0].countryCode, filteredState[0].stateCode)
    const list = []
    list.push({label: "Select City", value: null});
    cities.forEach((city, key) => {
      list.push({label: city.name, value: city.name})
    });
    setCitiesList(list);
    return list;
  }

  const handleCountrySelection = (target) => {
    if(target.value)
      setCountryError(false);
    setSelectedCountry(target.value);
    // reset state & city select
    setStatesList([]);
    setSelectedState(null);
    if(stateRef.current)
      stateRef.current.select.clearValue();
    setCitiesList([])
    setSelectedCity(null);
    if(cityRef.current)
      cityRef.current.select.clearValue();
    // prepare state select
    const states = csc.getStatesOfCountry(target.countryCode)
    const list = []
    list.push({label: "Select State/County", value: null, countryCode: null});
    states.forEach((state, key) => {
      const availableCities = csc.getCitiesOfState(state.countryCode, state.isoCode)
      if (availableCities.length > 0) {
        list.push({label: state.name, value: state.name, countryCode: state.countryCode, stateCode: state.isoCode})
      }
    });
    setStatesList(list);
  }

  const handelStateSelection = (target) => {
    if(target) {
      if(target.value)
        setStateError(false);
      setSelectedState(target.value);
      // reset city select
      setCitiesList([])
      setSelectedCity(null);
      if(cityRef.current)
        cityRef.current.select.clearValue();
      // prepare city select
      const cities = csc.getCitiesOfState(target.countryCode, target.stateCode)
      const list = []
      list.push({label: "Select City", value: null});
      cities.forEach((city, key) => {
        list.push({label: city.name, value: city.name})
      });
      setCitiesList(list);
    } else {
      setCitiesList([]);
      setSelectedState(null);
    }
  }

  const handleCitySelection = (target) => {
    if(target) {
      setSelectedCity(target.value)
    }
    else
      setSelectedCity(null);
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
            Edit Contact
          </li>
        </Breadcrumb>
      </div>
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Contact</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
            <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Name*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="name"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.name : ""}
                    placeholder="Name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Name is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Address*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="street"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.street : ""}
                    placeholder="Address"
                  />
                  <Form.Control.Feedback type="invalid">
                    Address is required!
                  </Form.Control.Feedback>
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
                    defaultValue={artist.contact_information && countriesList.filter(option => option.value === artist.contact_information.country)}
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
                  <Form.Label>State/County*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Select
                    ref={stateRef}
                    placeholder="Select State/County"
                    className="state-select-container-header"
                    classNamePrefix={!stateError ? "state-select-header" : "state-select-header invalid"}
                    options={statesList}
                    defaultValue={artist.contact_information && statesList.filter(option => option.value === artist.contact_information.state)}
                    onChange={handelStateSelection}
                    noOptionsMessage={() => {return "No state found"}}
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#c0d72d',
                      },
                    })}
                  />
                  {stateError &&
                    <small className="error">
                      State is required!
                    </small>
                  }
                </Col>
              </Row>
              <Row>
                
                <Col xl={2} md={4}>
                  <Form.Label>City</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Select
                    ref={cityRef}
                    placeholder="Select City"
                    className="city-select-container-header city-select-header"
                    options={citiesList}
                    defaultValue={artist.contact_information && citiesList.filter(option => option.value === artist.contact_information.city)}
                    onChange={handleCitySelection}
                    noOptionsMessage={() => {return "No city found"}}
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#c0d72d',
                      },
                    })}
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Postal Code*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="postal_code"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.postal_code : ""}
                    placeholder="Postal Code"
                  />
                  <Form.Control.Feedback type="invalid">
                    Postal code is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Phone*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="phone"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.phone : ""}
                    placeholder="Phone"
                  />
                  <Form.Control.Feedback type="invalid">
                    Phone is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={4}>
                  <Form.Label>Email*</Form.Label>
                </Col>
                <Col xl={4} md={8}>
                  <Form.Control
                    required
                    name="email"
                    type="email"
                    defaultValue={artist.contact_information ? artist.contact_information.email : ""}
                    placeholder="Email"
                  />
                  <Form.Control.Feedback type="invalid">
                    A valid email address is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col xl={2} md={0}></Col>
                <Col xl={4} md={12} className="text-center">
                  <NavLink to="/profile" className="btn primary-btn btn-outline-light mr-5 cancel">Cancel</NavLink>
                  <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img className="" src={Loader} alt="icon"/></> : "Save" }</Button>
                </Col>
              </Row>
            </Form>
          }
        </div>
      </section>
    </div>
  )
}

export default ContactEdit;