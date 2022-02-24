import React, {useRef, useState} from "react";
import "./Music.scss";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Loader from "../../../../images/loader.svg";
import Button from "react-bootstrap/Button";
import BulkDropzoneComponent from "../../../../common/Dropzone/BulkDropzoneComponent";
import {ACCESS_TOKEN, ALBUMS, BASE_URL, COLLABORATOR_ALBUMS} from "../../../../common/api";
import Notiflix from "notiflix";
import {ArtistContext} from "../../../../Store/artistContext";
import fetchAlbums from "../../../../common/utlis/fetchAlbums";
import axios from "axios";
import {ProgressBar} from "react-bootstrap";

function BulkUpload({album}) {
  const {artistState, artistActions} = React.useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const formBulkUpload = useRef(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [progressNow, setprogressNow] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bulkUploadForm = e.currentTarget;
    const data = new FormData(bulkUploadForm.current);
    if(tracks.length) {
      if(tracks.length > 20) {
        Notiflix.Report.warning( 'Upload Limit Exceeded', `You can bulk upload upto 20 tracks. ${tracks.length} tracks selected at the moment.`, 'Ok' );
        return false;
      }
      for(let i = 0; i < tracks.length; i++)
        data.append('files[]', tracks[i]);
    } else {
      Notiflix.Notify.warning('Please upload tracks!');
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
    await axios.request({
      headers: {
        "authorization": ACCESS_TOKEN,
        "auth-token": userAuthToken
      },
      method: "post",
      url: URL,
      data: data,
      onUploadProgress: (progress) => {
        let now = (progress.loaded / progress.total) * 100;
        setprogressNow(now.toFixed(0));
      }
    }).then (response => {
      if (!response.status === 200) {
        Notiflix.Notify.failure('Something went wrong, try later!', {
          timeout: 6000,
        });
      } else {
        if(response.data.meta.total === response.data.meta.uploaded) {
          Notiflix.Report.success( 'Uploaded', `${response.data.meta ? response.data.meta.uploaded : ""} Track(s) uploaded successfully out of ${response.data.meta.total} track(s) you selected.`, 'Ok' );
        } else if(!response.data.meta.uploaded) {
          Notiflix.Report.failure( 'Upload Failed', `None of your selected files matches our criteria. Please make sure to upload music files (WAV or AIFF) at 16bit or 24bit, at 44K, 44.1K or 48K.`, 'Ok' );
        } else {
          var invalidTracks = '';
          for(let i = 0; i < response.data.meta.messages.length; i++) {
            if(i === response.data.meta.messages.length)
              invalidTracks += '"'+response.data.meta.messages[0].file+'"';
            else
              invalidTracks += '"'+response.data.meta.messages[0].file+'", ';
          }
          Notiflix.Report.warning( 'Partially Uploaded', `${response.data.meta ? response.data.meta.uploaded : ""} Track(s) uploaded successfully out of ${response.data.meta.total} track(s) you selected. Track(s) ${invalidTracks} failed to upload.`, 'Ok' );
        }
      }
    })
    const albums = await fetchAlbums(userRole === "collaborator" && artist_id);
    artistActions.albumsStateChanged(albums);
    handleClose();
    setIsLoading(false);
  }

  const handleBulkUploadModal = ({album}) => {
    setShowBulkUploadModal(true);
  }

  const handleClose = () => {
    setTracks([]);
    setprogressNow(0);
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
        backdrop="static"
        keyboard={false}
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
              {isLoading && progressNow > 0 &&
                <div className="progress-bar-container">
                  <ProgressBar striped variant="success" now={progressNow} label={`${progressNow}%`}/>
                  {isLoading && progressNow >= 100 &&
                    <div className="response-note">
                      Completed, fetching results now...<img src={Loader} alt="icon"/>
                    </div>
                  }
                </div>
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button disabled={isLoading} onClick={handleClose} className="btn btn-outline-light">Cancel</Button>
            <Button type="submit" className="btn primary-btn submit">{isLoading ? progressNow >= 100 ? "Completed" : <>Uploading...<img src={Loader} alt="icon"/></> : "Upload"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default BulkUpload;