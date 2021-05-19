import React from "react";
import "./Music.scss";
import edit from '../../../../images/pencil.svg';

function Music() {

  return (
    <div className="musicWrapper">
      <h2>Music</h2>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Uploading Music</strong></h4>
            <p>We can't be a music company without music! You can create new albums and upload tracks to your portal.</p>
            <p>Please choose your album titles wisely, as they will now appear in our partner Storefronts for licensing Please do not include cates or other extensions in album titles. Ex: <i><strong>"My Amazing Tracks for Audiosocket 2012"</strong></i></p>
            <p>When uploading tracks, pleasureview your track names. Tracks should be edited to include what you would like them displayed as Ex: Track Name master <i> WAV </i> should be edited to <i><strong>Track Name</strong></i>. </p>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Albums</h2>
            <a href="" className="btn primary-btn">Create an album</a>
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
  </div>
    
  )
}

export default Music;