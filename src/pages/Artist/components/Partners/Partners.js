import React, {useRef, useState} from "react";
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

function Partners() {
  const [isLoading, SetIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useRef(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [showPublisherModal, setShowPublisherModal] = useState(false);
  const [pro, setPro] = useState(null);
  const proRef = useRef(null);

  const handleCreateCollaborator = async (e) => {

  }

  const handleCreatePublisher = async (e) => {

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
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
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
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
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
        <Form noValidate validated={validated} ref={form} onSubmit={handleCreateCollaborator}>
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
                        placeholder="Album Name*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Album name is required!
                      </Form.Control.Feedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="accept_agreement" className="checkbox my-3">
                        <input
                          name="accept_agreement"
                          id="accept_agreement"
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
                        name="name"
                        type="text"
                        defaultValue={''}
                        placeholder="Email*"
                      />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="CRUD-control" className="checkbox my-3">
                        <input
                          name="CRUD-control"
                          id="CRUD-control"
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
                        name="name"
                        type="text"
                        defaultValue={''}
                        placeholder="CAE/IPI #"
                      />
                      <small className="text-muted">This field is optional</small>
                      <div>
                      <small className="text-muted"><strong>Note</strong>: An IPI # is not the same as a member number,
                       its the  9 digit number that appears on the statements from your PRO</small>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="form-group">
                      <Form.Control as="select">
                        <option>Select PRO</option>
                      </Form.Control>
                      <small className="text-muted">This field is optional</small>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="form-group">
                      <label htmlFor="name_privacy" className="checkbox my-3">
                        <input
                          name="name_privacy"
                          id="name_privacy"
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
        <Form noValidate validated={validated} ref={form} onSubmit={handleCreatePublisher}>
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
                        required
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
                        required
                        name="name"
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
            <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Saving...<img src={Loader} alt="icon"/></> : "Save"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      }
  </div>
  )
}

export default Partners;