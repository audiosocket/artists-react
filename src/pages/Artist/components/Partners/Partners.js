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
import {ACCESS_TOKEN, BASE_URL, PUBLISHERS} from "../../../../common/api";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchCollaborators from "../../../../common/utlis/fetchCollaborators";
import fetchPublishers from "../../../../common/utlis/fetchPublishers";

function Partners() {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [collaborators, setCollaborators] = useState(null);
  const [publishers, setPublishers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [pro, setPro] = useState(null);
  const proRef = useRef(null);

  useEffect(() => {
    if (!artistState.collaborators)
      getCollaborators()
    else
      setCollaborators(artistState.collaborators)

    if (!artistState.publishers)
      getPublishers()
    else
      setPublishers(artistState.publishers)
  }, [])

  const getCollaborators = async () => {
    setIsLoading(true);
    const collaborators = await fetchCollaborators();
    setCollaborators(collaborators ?? null);
    artistActions.collaboratorsStateChanged(collaborators ?? null);
    setIsLoading(false);
  }

  const getPublishers = async () => {
    setIsLoading(true);
    const publishers = await fetchPublishers();
    setPublishers(publishers ?? null);
    artistActions.publishersStateChanged(publishers ?? null);
    setIsLoading(false);
  }

  const handleSubmitCollaborator = async (e) => {

  }

  const handleSubmitPublisher = async (e) => {
    e.preventDefault();
    const artistForm = e.currentTarget;
    if (artistForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsLoading(true);
      const data = new FormData(form.current);
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(`${BASE_URL}${PUBLISHERS}`,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken,
          },
          method: 'POST',
          body: data
        });
      const publishers = await response.json();
      if(!response.ok) {
        alert('Something went wrong, try later!');
      } else {
        const getPub = await getPublishers();
        //artistActions.publishersStateChanged(publishers);
        handleClose();
      }
      setIsLoading(false);
    }
  }

  const handleShowCollaboratorModal = () => {
    setShowPublisherModal(false);
    setShowCollaboratorModal(true);
  }

  const handelShowPublisherModal = () => {
    setShowCollaboratorModal(false);
    setShowPublisherModal(true);
  }

  const handleClose = () => {
    setShowCollaboratorModal(false);
    setShowPublisherModal(false);
    setValidated(false);
  }

  return (
    <div className="partnerWrapper">
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
            <a onClick={handleShowCollaboratorModal} className="btn primary-btn">Add a collaborator</a>
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              {!collaborators && <p>No collaborators created yet! Click <i className="medium-text">Add a collaborators</i> button to get started.</p>}
              {collaborators &&
              collaborators.map((collaborator, key) => {
                return (
                  collaborator.name && <li key={key}><a>{collaborator.name} <small>MOSEEG 3753</small></a></li>
                )
              })
              }
            </ul>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Publishers</h2>
            <a onClick={handelShowPublisherModal} className="btn primary-btn">Add a publisher</a>
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              {publishers &&
                publishers.map((publisher, key) => {
                  return (
                    publisher.name && <li key={key}><a>{publisher.name} <small>MOSEEG 3753</small></a></li>
                  )
                })
              }
            </ul>
            {!publishers && <p>No publishers created yet! Click <i className="medium-text">Add a publisher</i> button to get started.</p>}
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
                        required
                        name="name"
                        type="text"
                        defaultValue={''}
                        placeholder="Collaborator Name*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Collaborator Name is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="can_login" className="checkbox my-3">
                        <input
                          name="can_login"
                          id="can_login"
                          type="checkbox"
                        />
                          This person will be logging into this artist portal and/or they need to accept the Audicsocket license agreement
                          <span className={"checkmark"}></span>
                    </label>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required
                        name="email"
                        type="email"
                        defaultValue={''}
                        placeholder="Email*"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Email is required!
                    </Form.Control.Feedback>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="can_update_artist" className="checkbox my-3">
                        <input
                          name="can_update_artist"
                          id="can_update_artist"
                          type="checkbox"
                        />
                          Allow this person to update artist information, edit/create tracks and add/remove collaborators.
                          <span className={"checkmark"}></span>
                    </label>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        required
                        name="cae_ipi"
                        type="text"
                        defaultValue={''}
                        placeholder="CAE/IPI # (optional)"
                      />
                      <div>
                        <small className="text-muted">
                          <strong>Note</strong>: An IPI # is not the same as a member number, its the  9 digit number that appears on the statements from your PRO
                        </small>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Select
                        ref={proRef}
                        isSearchable={false}
                        placeholder="Select PRO"
                        className="pro-select-container-header"
                        classNamePrefix="pro-select-header react-select-popup"
                        options={[{label: "Select PRO", value: null},{label: "No", value: false}, {label: "Yes", value: true}]}
                        defaultValue={{label: "Select PRO", value: null}}
                        onChange={(target) => setPro(target.value)}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                      <small className="text-muted">This field is optional</small>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="is_pro_knows" className="checkbox my-3">
                        <input
                          name="is_pro_knows"
                          id="is_pro_knows"
                          type="checkbox"
                        />
                          My PRO knows me by a different registratered name.
                          <span className={"checkmark"}></span>
                    </label>
                    </div>
                  </Col>

                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Send Invitation"}</Button>
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
                        defaultValue={''}
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
                        isSearchable={false}
                        placeholder="Select PRO"
                        className="pro-select-container-header"
                        classNamePrefix="pro-select-header react-select-popup"
                        options={[{label: "Select PRO", value: null},{label: "No", value: false}, {label: "Yes", value: true}]}
                        defaultValue={{label: "Select PRO", value: null}}
                        onChange={(target) => setPro(target.value)}
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary: '#c0d72d',
                          },
                        })}
                      />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control
                        name="cae_ipi"
                        type="text"
                        defaultValue={''}
                        placeholder="CAE/IPI #"
                      />
                      <small className="text-muted">This field is optional</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Creating...<img src={Loader} alt="icon"/></> : "Create"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      }
  </div>
  )
}

export default Partners;