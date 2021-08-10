import React, {useRef, useState} from "react";
import "./Music.scss";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Loader from "../../../../images/loader.svg";
import Button from "react-bootstrap/Button";
import BulkDropzoneComponent from "../../../../common/Dropzone/BulkDropzoneComponent";
import {ACCESS_TOKEN, ALBUMS, BASE_URL, COLLABORATOR_ALBUMS} from "../../../../common/api";
import Notiflix from "notiflix-react";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";

function BulkUpload({album}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const formBulkUpload = useRef(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [tracks, setTracks] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bulkUploadForm = e.currentTarget;
    const data = new FormData(bulkUploadForm.current);
    if(tracks.length) {
      for(let i = 0; i < tracks.length; i++)
        data.append('files[]', tracks[i]);
    } else {
      Notiflix.Notify.Warning('Please upload tracks!');
      return false;
    }
    setIsLoading(true);
    let url = `${BASE_URL}${ALBUMS}/${album.id}/bulk_upload_tracks`;
    let artist_id = null;
    const userRole = artistState.userRole || JSON.parse(localStorage.getItem("userRole") ?? "");
    if(userRole === "collaborator") {
      artist_id = artistState.selectedArtist && artistState.selectedArtist.id;
      data.append("artist_id", artist_id)
      url = `${BASE_URL}${COLLABORATOR_ALBUMS}/${album.id}/bulk_upload_tracks`;
    }
    const userAuthToken = JSON.parse(localStorage.getItem("user") ?? "");
    const URL = url;
    const response = await fetch(`${URL}`,
      {
        headers: {
          "authorization": ACCESS_TOKEN,
          "auth-token": userAuthToken
        },
        method: "POST",
        body: data
      });
    const results = await response.json();
    if (!response.ok) {
      Notiflix.Notify.Failure('Something went wrong, try later!');
    } else {
      const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
      artistActions.albumsStateChanged(albums);
      handleClose();
      if(results.meta.total === results.meta.uploaded) {
        Notiflix.Report.Success( 'Uploaded', `${results.meta ? results.meta.uploaded : ""} Track(s) uploaded successfully out of ${results.meta.total} track(s) you selected.`, 'Ok' );
      } else if(!results.meta.uploaded) {
        Notiflix.Report.Failure( 'Upload Failed', `None of your selected files matches our criteria. Please make sure to upload music files (WAV or AIFF) at 16bit or 24bit, at 48K.`, 'Ok' );
      } else {
        var invalidTracks = '';
        for(let i = 0; i < results.meta.messages.length; i++) {
          if(i === results.meta.messages.length)
            invalidTracks += '"'+results.meta.messages[0].file+'"';
          else
            invalidTracks += '"'+results.meta.messages[0].file+'", ';
        }
        Notiflix.Report.Warning( 'Partially Uploaded', `${results.meta ? results.meta.uploaded : ""} Track(s) uploaded successfully out of ${results.meta.total} track(s) you selected. Track(s) ${invalidTracks} failed to upload.`, 'Ok' );
      }
    }
    setIsLoading(false);
  }

  const handleBulkUploadModal = ({album}) => {
    setShowBulkUploadModal(true);
  }

  const handleClose = () => {
    setTracks([]);
    setShowBulkUploadModal(false);
  }

  const handleUploads = (files) => {
    setTracks(files);
  }

  return (
    <>
      <a onClick={handleBulkUploadModal} className="btn primary-btn mr-2">Bulk upload</a>
      <Modal
        show={showBulkUploadModal}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="bulk-upload-modal customArtistModal"
      >
        <Form noValidate ref={formBulkUpload} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Bulk upload tracks
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-container music-modal-container">
              <BulkDropzoneComponent onUploadFiles={handleUploads} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} className="btn btn-outline-light">Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isLoading ? <>Uploading...<img src={Loader} alt="icon"/></> : "Upload"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default BulkUpload;