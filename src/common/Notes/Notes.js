import React, {useRef, useState} from "react";
import "./Notes.scss"
import NotesIcon from "../../images/add-notes.svg";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Loader from "../../images/loader.svg";

function Notes() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useRef(null);
  const [validated, setValidated] = useState(false);

  const handleSubmitNotes = () => {

  }

  const handleShowNotesModal = () => {
    setShowNotesModal(!showNotesModal);
  }

  const handleClose = () => {

  }

  return (
    <div className="notes-container">
      <img onClick={handleShowNotesModal} src={NotesIcon} alt="add-note"/>
      {showNotesModal &&
        <Modal
          show={showNotesModal}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="notes-modal"
        >
          <Form noValidate validated={validated} ref={form} onSubmit={handleSubmitNotes}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Notes
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="notes-modal-container">
                <div className="section">
                  <Row>
                    <Col xs={12}>
                      <div className="form-group">
                        <Form.Control
                          required
                          name="name"
                          type="text"
                          defaultValue={''}
                          placeholder="Message*"
                        />
                        <Form.Control.Feedback type="invalid">
                          Message is required!
                        </Form.Control.Feedback>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Form.Label>Attachments</Form.Label>
                    </Col>
                    <Col xl={4} md={6}>
                      <Form.File
                        accept=".png, .jpg, .svg"
                        name="attachments"
                        label={""}
                        lang="en"
                        custom
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-outline-light" onClick={handleClose}>Cancel</Button>
              <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Creating...<img src={Loader} alt="icon"/></> : "Add note"}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      }
    </div>
  );
}

export default Notes;