import React, { useRef, useState, useEffect } from 'react';
import './DropzoneComponent.scss';
import Delete from "../../images/close-circle-2.svg";
import close from "../../images/close-modal.svg";

const DropzoneComponent = ({onUploadFiles = null}) => {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setValidFiles([...filteredArr]);
    onUploadFiles(filteredArr);
  }, [selectedFiles]);

  const preventDefault = (e) => {
    e.preventDefault();
  }

  const dragOver = (e) => {
    preventDefault(e);
  }

  const dragEnter = (e) => {
    preventDefault(e);
  }

  const dragLeave = (e) => {
    preventDefault(e);
  }

  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      handleFiles(fileInputRef.current.files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const handleFiles = (files) => {
    for(let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
      }
    }
  }

  const validateFile = (file) => {
    const validTypes = ['audio/wav', 'audio/aiff'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }

    return true;
  }

  const fileSize = (size) => {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  const removeFile = (name) => {
    const index = validFiles.findIndex(e => e.name === name);
    const index2 = selectedFiles.findIndex(e => e.name === name);
    const index3 = unsupportedFiles.findIndex(e => e.name === name);
    validFiles.splice(index, 1);
    selectedFiles.splice(index2, 1);
    setValidFiles([...validFiles]);
    setSelectedFiles([...selectedFiles]);
    if (index3 !== -1) {
      unsupportedFiles.splice(index3, 1);
      setUnsupportedFiles([...unsupportedFiles]);
    }
  }


  return (
    <>
      <div className="container">
        {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
        <div className="drop-container"
             onDragOver={dragOver}
             onDragEnter={dragEnter}
             onDragLeave={dragLeave}
             onDrop={fileDrop}
             onClick={fileInputClicked}
        >
          <div className="drop-message">
            <div className="upload-icon"></div>
            Drag & Drop or click to upload track(s)
          </div>
          <input
            accept=".wav, .aiff"
            ref={fileInputRef}
            className="file-input"
            type="file"
            multiple
            onChange={filesSelected}
          />
        </div>
        <small>Please submit music files (WAV or AIFF) at 16bit or 24bit, at 48K.</small>
        <div className="file-display-container">
          {
            validFiles.map((data, i) =>
              <div className="file-status-bar" key={i}>
                <div>
                  <div className="file-type-logo"></div>
                  <div className="file-type">{fileType(data.name)}</div>
                  <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                  <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                </div>
                <div className="file-remove" onClick={() => removeFile(data.name)}><img className="close-icon" src={Delete} /></div>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default DropzoneComponent;