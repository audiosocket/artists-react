import React, {useEffect, useRef, useState} from "react";
import "./Profile.scss";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchArtist from "../../../../common/utlis/fetchArtist";
import Loader from "../../../../images/loader.svg";
import {NavLink, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {ACCESS_TOKEN, ARTIST_PROFILE_UPDATE, BASE_URL} from "../../../../common/api";
import csc from 'country-state-city'
import Select from 'react-select'

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
    if(!artistState.artist)
      getArtistProfile();
    else
      setArtist(artistState.artist);
    if(!artistState.countries) {
      prepareCountriesList();
    }
    else {
      setCountriesList(artistState.countries)
    }

  }, [])

  useEffect(() => {
    if(artistState.countries && artistState.artist.contact_information) {
      prepareStatesDropdown()
      prepareCitiesDropdown()
    }
  }, [artistState.artist])

  const getArtistProfile = async () => {
    setIsLoading(true);
    const artist = await fetchArtist();
    artistActions.artistStateChanged(artist);
    setArtist(artist);
    setIsLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistForm = e.currentTarget;
    if(!selectedCountry)
      setCountryError(true);
    if(!selectedState)
      setStateError(true);
    if (!selectedCity)
      setCityError(true);
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      if(countryError || stateError || cityError)
        return false;
      setIsLoading(true);
      const data = new FormData(form.current);
      const json = prepareJson(data);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${ARTIST_PROFILE_UPDATE}`,
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
        alert('Something went wrong, try later!');
      } else {
        setArtist(artist);
        artistActions.artistStateChanged(artist);
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
    list.push({label: "Select Country", value: null, key: null});
    countries.forEach((country, key) => {
      list.push({label: country.name, value: country.name, countryCode: country.isoCode})
    });
    setCountriesList(list);
    artistActions.countriesStateChanged(list);
  }

  const prepareStatesDropdown = () => {
    const filteredCountry = artistState.countries.filter(option => option.value === artistState.artist.contact_information.country);
    const states = csc.getStatesOfCountry(filteredCountry[0].countryCode)
    const list = []
    list.push({label: "Select State", value: null, countryCode: null});
    states.forEach((state, key) => {
      list.push({label: state.name, value: state.name, countryCode: state.countryCode, stateCode: state.isoCode})
    });
    setStatesList(list);
  }

  const prepareCitiesDropdown = () => {
    const filteredCountry = artistState.countries.filter(option => option.value === artistState.artist.contact_information.country);
    const states = csc.getStatesOfCountry(filteredCountry[0].countryCode)
    const tempStateList = []
    tempStateList.push({label: "Select State", value: null, countryCode: null});
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
    list.push({label: "Select State", value: null, countryCode: null});
    states.forEach((state, key) => {
      list.push({label: state.name, value: state.name, countryCode: state.countryCode, stateCode: state.isoCode})
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
    }
  }

  const handleCitySelection = (target) => {
    if(target) {
      setSelectedCity(target.value)
      if(target.value)
        setCityError(false);
    }
  }

  return (
    <div className="artist-wrapper">
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Edit Contact</h2>
          </div>
          {Object.keys(artist).length === 0 && isLoading && <h5>Loading profile... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
          {Object.keys(artist).length !== 0 &&
            <Form noValidate validated={validated} ref={form} onSubmit={handleSubmit}>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Name</Form.Label>
                </Col>
                <Col xl={4} md={6}>
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
                <Col xl={2} md={6}>
                  <Form.Label>Address</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Form.Control
                    required
                    name="street"
                    type="text"
                    defaultValue={artist.contact_information ? artist.contact_information.street : ""}
                    placeholder="Address"
                  />
                  <Form.Control.Feedback type="invalid">
                    Street is required!
                  </Form.Control.Feedback>
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Country</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Select
                    ref={countryRef}
                    placeholder="Select Country"
                    className="country-select-container-header"
                    classNamePrefix={!countryError ? "country-select-header" : "country-select-header invalid"}
                    options={countriesList}
                    value={artist.contact_information && countriesList.filter(option => option.value === artist.contact_information.country)}
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
                <Col xl={2} md={6}>
                  <Form.Label>State</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Select
                    ref={stateRef}
                    placeholder="Select State"
                    className="state-select-container-header"
                    classNamePrefix={!stateError ? "state-select-header" : "state-select-header invalid"}
                    options={statesList}
                    value={artist.contact_information && statesList.filter(option => option.value === artist.contact_information.state)}
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
                <Col xl={2} md={6}>
                  <Form.Label>City</Form.Label>
                </Col>
                <Col xl={4} md={6}>
                  <Select
                    ref={cityRef}
                    placeholder="Select City"
                    className="city-select-container-header"
                    classNamePrefix={!cityError ? "city-select-header" : "city-select-header invalid"}
                    options={citiesList}
                    value={artist.contact_information && citiesList.filter(option => option.value === artist.contact_information.city)}
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
                  {cityError &&
                    <small className="error">
                      City is required!
                    </small>
                  }
                </Col>
              </Row>
              <Row>
                <Col xl={2} md={6}>
                  <Form.Label>Postal Code</Form.Label>
                </Col>
                <Col xl={4} md={6}>
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
                <Col xl={2} md={6}></Col>
                <Col xl={4} md={6} className="text-center">
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