import React, {useState} from "react";
import "./Music.scss";
import edit from '../../../../images/pencil.svg';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Music() {
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);

  const handleClose = () => {
    setShowCreateAlbumModal(false);
  }

  return (
    <div className="musicWrapper">
      <h2>Music</h2>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Uploading Music</strong></h4>
            <p>We can't be a music company without music! You can create new albums and upload tracks to your portal.</p>
            <p>Please choose your album titles wisely, as they will now appear in our partner Storefronts for licensing. Please do not include dates or other extensions in album titles. Ex: <i><strong>"My Amazing Tracks for Audiosocket 2012"</strong></i></p>
            <p>When uploading tracks, please view your track names. Tracks should be edited to include what you would like them displayed as Ex: <i><strong>"Track Name master  WAV"</strong></i> should be edited to <i><strong>"Track Name"</strong></i>.</p>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Albums</h2>
            <a onClick={() => setShowCreateAlbumModal(true)} className="btn primary-btn">Create an album</a>
          </div>
          <div className="music-playlist">
            <ul className="music-row">
              <li><a href="">A Day in the Life</a></li>
              <li><a href="">ABC</a></li>
              <li><a href="">10 Seconds of Forever</a></li>
              <li><a href="">After Forever</a></li>
              <li><a href="">Big Country</a></li>
              <li><a href="">Bonded by Blood</a></li>
              <li><a href="">Bury Your Dead</a></li>
              <li><a href="">Carnal Forge</a></li>
              <li><a href="">Cocteau Twins</a></li>
              <li><a href="">Deep Purple</a></li>
              <li><a href="">Ella Guru</a></li>
              <li><a href="">Famous Last Words</a></li>
            </ul>
          </div>
        </section>
    </div>
      {showCreateAlbumModal &&
        <Modal
          show={showCreateAlbumModal}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Centered Modal</h4>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
              consectetur ac, vestibulum at eros.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      }
  </div>
  )
}

export default Music;