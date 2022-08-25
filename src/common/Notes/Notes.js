import React, {useEffect, useRef, useState} from "react";
import "./Notes.scss"
import NotesIcon from "../../images/add-notes.svg";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Loader from "../../images/loader.svg";
import {ACCESS_TOKEN, BASE_URL, COLLABORATOR_NOTES, NOTES} from "../api";
import Notiflix from "notiflix";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import fetchNotes from "../utlis/fetchNotes";

function Notes(props) {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [file, setFile] = useState(null);
  const formNotes = useRef(null);
  const [validated, setValidated] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if(showNotesModal)
      getNotes();
  }, [showNotesModal])

  const getNotes = async () => {
    setIsLoading(true);
    const notes = await fetchNotes(props.type, props.id, props.role || "artist", props.artist_id || null);
    setNotes(notes);
    setIsLoading(false);
  }

  const handleSubmitNotes = async (e) => {
    e.preventDefault();
    const musicForm = e.currentTarget;
    if (musicForm.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      setIsAdding(true);
      const data = new FormData(formNotes.current);
      if(!file) {
        data.delete('file')
      } else {
        data.delete('file')
        data.append('files[]', file);
      }
      data.append('notable_id', props.id)
      data.append('notable_type', props.type)
      let url = `${BASE_URL}${NOTES}`;
      if(props.role === 'collaborator') {
        url = `${BASE_URL}${COLLABORATOR_NOTES}`;
        data.append('artist_id', props.artist_id)
      }
      const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
      const response = await fetch(url,
        {
          headers: {
            "authorization": ACCESS_TOKEN,
            "auth-token": userAuthToken
          },
          method: "POST",
          body: data
        });
      if(response.ok) {
        Notiflix.Notify.success('Note added, your request will be proceed soon!');
        handleClose();
      } else {
        Notiflix.Notify.failure('Something went wrong, try again!', {
          timeout: 6000000,
          clickToClose: true,
        });
      }
      setIsAdding(false);
    }
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    if(e.target.files[0])
      setFile(e.target.files[0])
  }

  const handleShowNotesModal = (e) => {
    e.preventDefault();
    setShowNotesModal(!showNotesModal);
  }

  const handleClose = () => {
    setShowNotesModal(false);
    setValidated(false);
    setFile(null);
    setNotes([]);
  }

  return (
    <div className="notes-container">
      <OverlayTrigger placement={props.tooltipPosition || "top"} overlay={<Tooltip id="tooltip-right">{props.tooltipText || "Add a note to request changes"}</Tooltip>}>
        <img onClick={handleShowNotesModal} src={NotesIcon} alt="add-note"/>
      </OverlayTrigger>
      <Modal
        show={showNotesModal}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="notes-modal customArtistModal"
      >
        <Form noValidate validated={validated} ref={formNotes} onSubmit={handleSubmitNotes}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.title} Notes
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <div className="loading">Fetching previous notes...<img src={Loader} alt="icon"/></div> }
            <div className="notes-modal-container">
              <div className="section">
                {notes.length > 0 &&
                  <div className="existing-notes">
                    {notes.map((note, key) => {
                      return (
                        <div key={key} className="note-item">
                          <div className="note">
                            {note.description}
                            <small><br/>- {note.status === 'pending' ? 'In process' : note.status}</small>
                          </div>
                          {note.files.length > 0 &&
                          <img src={note.files[0]} alt="Picture"/>
                          }
                        </div>
                      )
                    })}
                  </div>
                }
                <Form.Control
                  required
                  rows={3}
                  name="form"
                  type="hidden"
                  value={"notes"}
                  placeholder="Type a note*"
                />
                <div className="typeSec">
                  <div className="form-group">
                    <Form.Control
                      required
                      as="textarea"
                      rows={3}
                      name="description"
                      type="textarea"
                      defaultValue={''}
                      placeholder="Type a note*"
                    />
                  </div>
                  <OverlayTrigger overlay={<Tooltip>{file ? file.name+" uploaded" : "Add attachment"}</Tooltip>}>
                    <div className="controlArea">
                      <label>
                        <Form.File
                          accept=".png, .jpg, .svg"
                          name="file"
                          onChange={handleFileChange}
                          label={""}
                          lang="en"
                          className="d-none"
                        />
                        {file
                          ? <img className="preview" src={URL.createObjectURL(file)}></img>
                          : <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="paperclip" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-paperclip fa-w-16 fa-5x"><path fill="gray" d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"></path></svg>
                        }
                      </label>
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} className="btn btn-outline-light">Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isAdding ? <>Adding...<img src={Loader} alt="icon"/></> : "Add note"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Notes;