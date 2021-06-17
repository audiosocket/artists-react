import React, {useRef, useState} from "react";
import "./Notes.scss"
import NotesIcon from "../../images/add-notes.svg";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Loader from "../../images/loader.svg";
import dummy from "../../images/artist-banner.jpg";

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
      <span className="notes-badge">2</span>
      <img onClick={handleShowNotesModal} src={NotesIcon} alt="add-note"/>
      {showNotesModal &&
        <Modal
          show={showNotesModal}
          onHide={handleClose}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="notes-modal customArtistModal"
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
                  <div className="existing-notes">
                    <div className="note">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </div>
                    <div className="note">
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </div>
                    <img src={dummy} alt="Picture"/>
                  </div>
                  <div className="typeSec">
                    <div className="form-group">
                      <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        name="name"
                        type="textarea"
                        defaultValue={''}
                        placeholder="Type a note*"
                      />
                      <Form.Control.Feedback type="invalid">
                        Message is required!
                      </Form.Control.Feedback>
                    </div>
                    <div className="controlArea">
                      <label>
                        <Form.File
                          accept=".png, .jpg, .svg"
                          name="attachments"
                          label={""}
                          lang="en"
                          className="d-none"
                        />
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="paperclip" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-paperclip fa-w-16 fa-5x"><path fill="gray" d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z" class=""></path></svg>
                      </label>
                    </div>
                  </div>
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