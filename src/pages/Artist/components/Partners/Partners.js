import React, {useEffect, useRef, useState} from "react";
import "./Partners.scss";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Loader from "../../../../images/loader.svg";
import Select from "react-select";
import {
  ACCESS_TOKEN, ARTISTS_COLLABORATORS,
  BASE_URL, COLLABORATOR_ARTIST_COLLABORATORS, COLLABORATOR_INVITE_COLLABORATORS, COLLABORATOR_PUBLISHERS,
  INVITE_COLLABORATORS,
  PRO_LIST,
  PUBLISHERS, RESEND_COLLABORATOR_INVITE_COLLABORATORS, RESEND_INVITE_COLLABORATORS
} from "../../../../common/api";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";
import Edit from "../../../../images/pencil.svg";
import Delete from "../../../../images/delete.svg";
import Resend from "../../../../images/invitation.svg";
import Notiflix from "notiflix";
import ArrowRight from "../../../../images/right-arrow.svg";
import fetchArtistsList from "../../../../common/utlis/fetchArtistsList";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function Partners() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [collaborators, setCollaborators] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [pro, setPro] = useState(null);
  const [proError, setProError] = useState(false);
  const proRef = useRef(null);
  const [differentName, setDifferentName] = useState(false);
  const [agreements, setAgreements] = useState(false);
  const [access, setAccess] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [registeredName, setRegisteredName] = useState(null);
  const [ipiFlag, setIpiFlag] = useState(false);

  useEffect(() => {
    if (artistState.collaborators)
      setCollaborators(artistState.collaborators)
    if (artistState.publishers)
      setPublishers(artistState.publishers)
  }, [artistState.collaborators, artistState.publishers])

  const handleSubmitCollaborator = async (e) => {
    e.preventDefault();
    setProError(false);
    if(!pro) {
      setProError(true);
    }
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      const data = new FormData(form.current);
      if(pro) {
        if(pro !== "other")
          data.append('collaborator_profile_attributes[pro]', pro);
        if(data.get('collaborator_profile_attributes[ipi]'))
          if(!handleIPICharacterLimit(data.get('collaborator_profile_attributes[ipi]')))
            return false
      } else {
        return false
      }
      setIsLoading(true);
      if(data.get("collaborator_profile_attributes[different_registered_name]")) {
        data.set("collaborator_profile_attributes[different_registered_name]", data.get('different_registered_name'))
        data.delete("different_registered_name")
      } else
        data.delete("collaborator_profile_attributes[different_registered_name]")
      if(data.get("agreements") && data.get("agreements") === "true" && !data.get("access")) {
        data.delete("agreements")
        data.set("access", "read");
      }
      if(data.get("access") && data.get("access") === "true")
        data.set("access", "write");
      if(selectedPartner) {
        data.delete("email");
      }
      let url = selectedPartner ? `${BASE_URL}${ARTISTS_COLLABORATORS}/${selectedPartner.id}` : `${BASE_URL}${INVITE_COLLABORATORS}`;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        let artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id);
        url = selectedPartner ? `${BASE_URL}${COLLABORATOR_ARTIST_COLLABORATORS}/${selectedPartner.id}` : `${BASE_URL}${COLLABORATOR_INVITE_COLLABORATORS}`;
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken,
          },
          method: 'PATCH',
          body: data
        });
      const collaborators = await response.json();
      if(!response.ok) {
        if(collaborators.message) {
          Notiflix.Notify.failure(collaborators.message, {
            timeout: 6000000,
            clickToClose: true,
          });
        } else {
          Notiflix.Notify.failure('Something went wrong, try later!', {
            timeout: 6000000,
            clickToClose: true,
          });
        }
      } else {
        Notiflix.Notify.success(`Collaborator ${selectedPartner ? 'updated' : 'created'} successfully!`);
        setCollaborators(collaborators.length ? collaborators : []);
        artistActions.collaboratorsStateChanged(collaborators.length ? collaborators : null);
        handleClose();
      }
      setIsLoading(false);
    }
  }

  const handleSubmitPublisher = async (e) => {
    e.preventDefault();
    setProError(false);
    if(!pro) {
      setProError(true);
    }
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      const data = new FormData(form.current);
      if(pro) {
        let publisher_users_attributes = [];
        if(data.get('ipi'))
          if(!handleIPICharacterLimit(data.get('ipi')))
            return false
        if(pro !== 'other') {
          if(selectedPartner)
            publisher_users_attributes.push({'pro': pro, 'ipi': data.get('ipi'), id: selectedPartner.publisher_users[0].id});
          else
            publisher_users_attributes.push({'pro': pro, 'ipi': data.get('ipi')});
          data.append('publisher_users_attributes', JSON.stringify(publisher_users_attributes));
        }
      } else {
        return false;
      }
      setIsLoading(true);
      let url = selectedPartner ? `${BASE_URL}${PUBLISHERS}/${selectedPartner.id}` : `${BASE_URL}${PUBLISHERS}`;
      const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
      if(userRole === "collaborator") {
        let artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
        data.append("artist_id", artist_id);
        url = selectedPartner ? `${BASE_URL}${COLLABORATOR_PUBLISHERS}/${selectedPartner.id}` : `${BASE_URL}${COLLABORATOR_PUBLISHERS}`;
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken,
          },
          method: selectedPartner ? 'PATCH' : 'POST',
          body: data
        });
      const publishers = await response.json();
      if(!response.ok) {
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000000,
          clickToClose: true,
        });
      } else {
        Notiflix.Notify.success(`Publisher ${selectedPartner ? 'updated' : 'created'} successfully!`);
        setPublishers(publishers.length ? publishers : []);
        artistActions.publishersStateChanged(publishers.length ? publishers : null);
        handleClose();
      }
      setIsLoading(false);
    }
  }

  const handleShowCollaboratorModal = (e, collaborator = null) => {
    if(collaborator) {
      setSelectedPartner(collaborator);
      if(collaborator.collaborator_profile?.pro && PRO_LIST.filter(item => item.value === collaborator.collaborator_profile.pro).length === 0) {
        setPro("other");
      } else {
        setPro(collaborator.collaborator_profile ? collaborator.collaborator_profile.pro : null);
      }
      setDifferentName(collaborator.collaborator_profile ? !!collaborator.collaborator_profile.different_registered_name : false)
      setRegisteredName(collaborator.collaborator_profile ? collaborator.collaborator_profile.different_registered_name || null : null)
      setAgreements(collaborator.access === "read" || collaborator.access === "write")
      setAccess(collaborator.access === "write")
    }
    setShowPublisherModal(false);
    setShowCollaboratorModal(true);
  }

  const handelShowPublisherModal = (e, publisher = null) => {
    if(publisher) {
      setSelectedPartner(publisher);
      if(publisher.pro && PRO_LIST.filter(item => item.value === publisher.pro).length === 0) {
        setPro("other");
      } else {
        setPro(publisher.publisher_users[0].pro ?? null);
      }
    }
    setShowCollaboratorModal(false);
    setShowPublisherModal(true);
  }

  const handleClose = () => {
    setShowCollaboratorModal(false);
    setShowPublisherModal(false);
    setValidated(false);
    setAgreements(false);
    setAccess(false);
    setSelectedPartner(null);
    setPro(null);
    setProError(false);
    setIsLoading(false);
    setDifferentName(false);
    setRegisteredName(null);
    setIpiFlag(false);
  }

  const handleChangeAgreements = (e) => {
    setAgreements(!agreements);
  }

  const handleChangeAccess = (e) => {
    setAccess(!access);
  }

  const handleDeleteCollaborator = async (e, collaborator) => {
    Notiflix.Confirm.show(
      'Please confirm',
      `Are you sure to delete collaborator "${collaborator.first_name} ${collaborator.last_name ?? ''}"?`,
      'Yes',
      'No',
      async function(){
        let artist_id = null;
        let url = `${BASE_URL}${ARTISTS_COLLABORATORS}/${collaborator.id}`;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
          artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${COLLABORATOR_ARTIST_COLLABORATORS}/${collaborator.id}?artist_id=${artist_id}`;
        }
        const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
        const response = await fetch(url,
          {
            headers: {
              "authorization": ACCESS_TOKEN,
              "auth-token": userAuthToken
            },
            method: "DELETE"
          });
        const results = await response.json();
        if (!response.ok) {
          Notiflix.Notify.failure(results.message, {
            timeout: 6000000,
            clickToClose: true,
          });
        } else {
          Notiflix.Notify.success(`Collaborator "${collaborator.first_name} ${collaborator.last_name ?? ''}" deleted successfully!`);
          const collaborators = await fetchCollaborators(userRole === "collaborator" && artist_id);
          if(userRole === "collaborator" && collaborators === "Not accessible") {
            artistActions.selectedArtistStateChanged(null);
            artistActions.collaboratorsStateChanged(null);
            const artistsList = await fetchArtistsList();
            artistActions.artistsListStateChanged(artistsList);
            setCollaborators([]);
          } else {
            artistActions.collaboratorsStateChanged(collaborators);
            setCollaborators(collaborators);
          }
        }
      }
    );
  }

  const handleDeletePublisher = async (e, publisher) => {
    Notiflix.Confirm.show(
      'Please confirm',
      `Are you sure to delete publisher "${publisher.name}"?`,
      'Yes',
      'No',
      async function(){
        let artist_id = null;
        let url = `${BASE_URL}${PUBLISHERS}/${publisher.id}`;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
           artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${COLLABORATOR_PUBLISHERS}/${publisher.id}?artist_id=${artist_id}`;
        }
        const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
        const response = await fetch(url,
          {
            headers: {
              "authorization": ACCESS_TOKEN,
              "auth-token": userAuthToken
            },
            method: "DELETE"
          });
        const results = await response.json();
        if (!response.ok) {
          Notiflix.Notify.failure(results.message, {
            timeout: 6000000,
            clickToClose: true,
          });
        } else {
          Notiflix.Notify.success(`Publisher "${publisher.name}" deleted successfully!`);
          const publishers = await fetchPublishers(userRole === "collaborator" && artist_id);
          artistActions.publishersStateChanged(publishers);
          setPublishers(publishers);
        }
      }
    );
  }

  const handleChangeDifferentName = (e) => {
    setDifferentName(!differentName);
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

  const handleFollowUpEmail = async (e, collaborator) => {
    Notiflix.Confirm.show(
      'Please confirm',
      `Are you sure to send a follow up to "${collaborator.first_name} ${collaborator.last_name ?? ''}"?`,
      'Yes',
      'No',
      async function(){
        let artist_id = null;
        let url = `${BASE_URL}${RESEND_INVITE_COLLABORATORS}?artists_collaborator_id=${collaborator.id}`;
        const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
        if(userRole === "collaborator") {
          artist_id =  artistState.selectedArtist && artistState.selectedArtist.id;
          url = `${BASE_URL}${RESEND_COLLABORATOR_INVITE_COLLABORATORS}?artist_id=${artist_id}&artists_collaborator_id=${collaborator.id}`;
        }
        const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
        const response = await fetch(url,
          {
            headers: {
              "authorization": ACCESS_TOKEN,
              "auth-token": userAuthToken
            },
            method: "PATCH"
          });
        if (!response.ok) {
          Notiflix.Notify.failure("Something went wrong, try later!", {
            timeout: 6000000,
            clickToClose: true,
          });
        } else {
          Notiflix.Notify.success(`Follow up email sent successfully!`);
        }
      }
    );
  }

  return (
    <div className="partnerWrapper">
      <div className="next-btn">
        <NavLink to="/music" className="btn primary-btn next">Next <img className="" src={ArrowRight} alt="proceed-icon"/></NavLink>
      </div>
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <NavLink to="/">Home</NavLink>
          </li>
          <li className="breadcrumb-item active">
            Partners
          </li>
        </Breadcrumb>
      </div>
      <div className="partnerBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Partners in crime</strong></h4>
            <p>Who's a collaborator? Anyone who's associated with this artist. Your fellow band members, a record label rep, or even your manager. Collaborators with an IPI number and PRO can be attached to track uploads as writers.</p>
            <p> All of your co-writers must be invited under the Collaborators section and they must accept the agreement before your music becomes live to our classification team.</p>
            <p>We've added a section for Publishers. If you have a Publishing entity, you must list it here to receive publishing royalties.</p>
            <p>Please note that you will not be able to edit a track's writers and publishers after submitting that track for classification. If needed, shoot us an email at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a> and we'll unlock it.</p>

          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Collaborators</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <a onClick={handleShowCollaboratorModal} className="btn primary-btn">Add a collaborator</a>
            }
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              {!collaborators.length && isLoading && <h5>Loading collaborators... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
              {collaborators.length !== 0
                ? collaborators.map((collaborator, key) => {
                    return (
                      collaborator &&
                        <li key={key}>
                          <a>{collaborator.first_name} {collaborator.last_name ?? ''} <small><i>Permissions: {collaborator.access}</i></small><small><i>{collaborator.collaborator_profile && collaborator.collaborator_profile.pro ? ", PRO: "+collaborator.collaborator_profile.pro : ""}</i></small><small><i>{collaborator.collaborator_profile && collaborator.collaborator_profile.ipi ? ", IPI: "+collaborator.collaborator_profile.ipi : ""}</i></small> - <strong className={"status "+collaborator.status}>{collaborator.status ?? ''}</strong></a>
                          {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
                            <div className="partner-actions">
                              {collaborator.status !== 'accepted' &&
                                <OverlayTrigger overlay={<Tooltip>Send a follow up to collaborator</Tooltip>}>
                                  <img className="resend" onClick={(e) => handleFollowUpEmail(e, collaborator)} src={Resend} alt="resend-icon"/>
                                </OverlayTrigger>
                              }
                              <img onClick={(e) => handleShowCollaboratorModal(e, collaborator)} src={Edit} alt="edit-icon"/>
                              <img onClick={(e) => handleDeleteCollaborator(e, collaborator)} src={Delete} alt="delete-icon"/>
                            </div>
                          }
                        </li>
                    )
                  })
                : !isLoading && <p>No collaborators created yet! Click <i className="medium-text">Add a collaborator</i> button to get started.</p>
              }
            </ul>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Publishers</h2>
            {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
              <a onClick={handelShowPublisherModal} className="btn primary-btn">Add a publisher</a>
            }
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              {!publishers.length && isLoading && <h5>Loading collaborators... <img className="loading" src={Loader} alt="loading-icon"/></h5>}
              {publishers.length !== 0
                ? publishers.map((publisher, key) => {
                    return (
                      publisher.name && !publisher?.default_publisher &&
                        <li key={key}>
                          <a>{publisher.name} <small><i>{publisher.pro ? "PRO: "+publisher.pro : ""}</i></small><small><i>{publisher.ipi ? ", IPI: "+publisher.ipi : ""}</i></small></a>
                          {(!artistState.selectedArtist || artistState.selectedArtist.access === 'write') &&
                            <div className="partner-actions">
                              <img onClick={(e) => handelShowPublisherModal(e, publisher)} src={Edit} alt="edit-icon"/>
                              {!publisher?.default_publisher && <img onClick={(e) => handleDeletePublisher(e, publisher)} src={Delete} alt="delete-icon"/>}
                            </div>
                          }
                        </li>
                    )
                  })
                : !isLoading && <p>No publishers created yet! Click <i className="medium-text">Add a publisher</i> button to get started.</p>
              }
            </ul>
          </div>
        </section>
    </div>
      {showCollaboratorModal &&
      <Modal
        show={showCollaboratorModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="customArtistModal-lg collabortor-modal">
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitCollaborator}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Invite Collaborator
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modalBodyInner collabortor-modal-container">
              <div className="section">
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required={!selectedPartner}
                        readOnly={!!selectedPartner}
                        name="name"
                        type="text"
                        defaultValue={selectedPartner ? selectedPartner.last_name ? selectedPartner.first_name + ' '+ selectedPartner.last_name : selectedPartner.first_name : ''}
                        placeholder="Collaborator Name*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Collaborator Name is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required={!selectedPartner}
                        readOnly={!!selectedPartner}
                        name="email"
                        type="email"
                        defaultValue={selectedPartner ? selectedPartner.email : ''}
                        placeholder="Email*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Email is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Select
                        ref={proRef}
                        placeholder="Select PRO"
                        className="pro-select-container-header"
                        classNamePrefix={!proError ? "pro-select-header react-select-popup" : "pro-select-header react-select-popup invalid"}
                        options={PRO_LIST}
                        defaultValue={selectedPartner ? selectedPartner.collaborator_profile && PRO_LIST.filter(item => item.value === selectedPartner.collaborator_profile?.pro).length === 0 ? {label: "Other", value: 'other'} : PRO_LIST.filter(item => item.value === selectedPartner.collaborator_profile?.pro) : {label: "Select PRO", value: null}}
                        onChange={(target) => {setProError(false);setPro(target.value)}}
                        maxMenuHeight={160}
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
                      <small><strong>Note:</strong> if you're not registered with a PRO, please select NS from the dropdown (no society)</small><br />
                      <small>All co-writers, publishers, labels and other right-holders must sign the agreement too</small>
                    </div>
                  </Col>
                  {pro === "other" &&
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="collaborator_profile_attributes[pro]"
                          type="text"
                          defaultValue={selectedPartner && selectedPartner.collaborator_profile && selectedPartner.collaborator_profile.pro}
                          placeholder="Enter your PRO name"
                        />
                        <Form.Control.Feedback type="invalid">
                          PRO name is required!
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  }
                  {pro && pro.toLowerCase() !== 'ns' &&
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="collaborator_profile_attributes[ipi]"
                          type="number"
                          defaultValue={selectedPartner && selectedPartner.collaborator_profile ? selectedPartner.collaborator_profile.ipi : ''}
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
                      </div>
                    </Col>
                  }
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="collaborator_profile_attributes[different_registered_name]" className="partners checkbox my-3">
                        <input
                          name="collaborator_profile_attributes[different_registered_name]"
                          id="collaborator_profile_attributes[different_registered_name]"
                          type="checkbox"
                          value={differentName}
                          checked={differentName}
                          onChange={handleChangeDifferentName}
                        />
                          My PRO knows me by a different registered name, please list full middle last name as registered with your PRO
                          <span className={differentName ? "checkmark checked" : "checkmark"}></span>
                    </label>
                    </div>
                  </Col>
                  {differentName &&
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="different_registered_name"
                          type="text"
                          defaultValue={selectedPartner ? registeredName ?? '' : ''}
                          placeholder="Full name registered with your PRO. Ex: First Middle Last*"
                        />
                        <Form.Control.Feedback type="invalid">
                          Registered full name is required!
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  }
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="agreements" className="partners checkbox my-3">
                        <input
                          name="agreements"
                          id="agreements"
                          type="checkbox"
                          value={agreements}
                          checked={agreements}
                          onChange={handleChangeAgreements}
                        />
                        This person will be logging into this artist portal and/or they need to accept the Audiosocket license agreement
                        <span className={agreements ? "checkmark checked" : "checkmark"}></span>
                      </label>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="access" className="partners checkbox my-3">
                        <input
                          name="access"
                          id="access"
                          type="checkbox"
                          value={access}
                          checked={access}
                          onChange={handleChangeAccess}
                        />
                        Allow this person to update artist information, edit/create tracks and add/remove collaborators.
                        <span className={access ? "checkmark checked" : "checkmark"}></span>
                      </label>
                    </div>
                  </Col>

                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            {selectedPartner
              ? <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Save"}</Button>
              : <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Sending...<img src={Loader} alt="icon"/></> : "Send Invitation"}</Button>
            }
          </Modal.Footer>
        </Form>
      </Modal>
      }
      {showPublisherModal &&
      <Modal
        show={showPublisherModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="customArtistModal publisher-modal"
      >
        <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitPublisher}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              New Publisher
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="publisher-modal-container">
              <div className="section">
                <Row>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required
                        name="name"
                        type="text"
                        disabled={selectedPartner?.default_publisher}
                        defaultValue={selectedPartner ? selectedPartner.name : ''}
                        placeholder="Publisher Name*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Publisher name is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Select
                        ref={proRef}
                        placeholder="Select PRO"
                        className="pro-select-container-header"
                        classNamePrefix={!proError ? "pro-select-header react-select-popup" : "pro-select-header react-select-popup invalid"}
                        options={PRO_LIST}
                        defaultValue={selectedPartner ? selectedPartner.publisher_users[0].pro && PRO_LIST.filter(item => item.value === selectedPartner.publisher_users[0].pro).length === 0 ? {label: "Other", value: 'other'} : PRO_LIST.filter(item => item.value === selectedPartner.publisher_users[0].pro) : {label: "Select PRO", value: null}}
                        onChange={(target) => {setProError(false);setPro(target.value)}}
                        maxMenuHeight={140}
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
                      <small><strong>Note:</strong> if you're not registered with a PRO, please select NS from the dropdown (no society)</small><br />
                      <small>All co-writers, publishers, labels and other right-holders must sign the agreement too</small>
                    </div>
                  </Col>
                  {pro === "other" &&
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required
                        name="pro"
                        type="text"
                        defaultValue={selectedPartner && selectedPartner.publisher_users[0].pro}
                        placeholder="Enter your PRO name"
                      />
                      <Form.Control.Feedback type="invalid">
                        PRO name is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  }
                  {pro && pro.toLowerCase() !== 'ns' &&
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="ipi"
                          type="number"
                          defaultValue={selectedPartner ? selectedPartner.publisher_users[0].ipi : ''}
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
                      </div>
                    </Col>
                  }
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            {selectedPartner
              ? <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Save"}</Button>
              : <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Creating...<img src={Loader} alt="icon"/></> : "Create"}</Button>
            }
          </Modal.Footer>
        </Form>
      </Modal>
      }
  </div>
  )
}

export default Partners;