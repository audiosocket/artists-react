import React from "react";
import "./Profile.scss";
import cover from '../../../../images/artist-cover.jpg';
import banner from '../../../../images/artist-banner.jpg';

function Profile() {

  return (
    <div className="artist-wrapper">
      <section className="artist-section-control">
        <div className="section-content">
          <div className="section-head">
            <h2>Profile</h2>
            <a href="" className="btn primary-btn">Edit</a>
          </div>
          <div className="section-body">
            <div className="w-custom-percent">
              <div className="parallel-info">
                <label>name</label>
                <div className="info-ans">jetty rae</div>
              </div>

              <div className="parallel-info">
                <label>cover image</label>
                <div className="info-ans">
                  <img src={cover} alt="Cover Image"  className="" />
                </div>
              </div>

              <div className="parallel-info">
                <label>banner image</label>
                <div className="info-ans">
                  <img src={banner} alt="Banner Image"  className="" />
                </div>
              </div>

              <div className="parallel-info">
                <label>additional images</label>
                <div className="info-ans">
                  <div className="bg-content yellow">
                    Have additional images for us? <a href="">Upload them here</a> for <span classname="artist-name">Jetty Rae</span> 
                  </div>
                </div>
              </div>

              <div className="parallel-info">
                <label>sounds like</label>
                <div className="info-ans">
                  Ingrid Michaelson, Regina Spektor, Adele, Norah Jones, Colbie Caillat
                </div>
              </div>

              <div className="parallel-info">
                <label>bio</label>
                <div className="info-ans">
                  For fans of: Ingrid Michaelson, Adele, Norah Jones, Co Callal, Regina Spektor. Jelly Rae is happily located in heart of the Michigan, and her music can be classified both acoustic and folk with a touch of soul. Jetty has shared the stage with Sarah McLachlan, Miranda Lambe and Grace Potter.
                </div>
              </div>

              <div className="parallel-info">
                <label>key facts</label>
                <div className="info-ans">
                  <div className="bg-content yellow">
                    It looks like there are no a key facts for <span classname="artist-name">Jetty Rae</span> yet. <a href="">Tell us a bit</a>, we'd love to know more!
                  </div>
                </div>
              </div>

              <div className="parallel-info social">
                <label>Social</label>
                <div className="info-ans">
                  <p>www.twitter.com<a href="www.twitter.com" target="_blank">/jettyrae</a></p>
                  <p>www.facebook.com<a href="www.facebook.com" target="_blank">/jettyrae</a></p>
                  <p>www.instagram.com<a href="www.instagram.com" target="_blank">/jettyrae</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="artist-section-control contact">
        <div className="section-content">
          <div className="section-head">
            <h2>Contact</h2>
            <a href="" className="btn primary-btn">Edit</a>
          </div>
          <div className="section-body">
            <div className="parallel-info">
              <label>address</label>
              <div className="info-ans">
                <span>Jason Stewart</span>
                <span>Jetty Rae LLC Charlevoix, MI</span>
                <span>6801 Ferry Avenue</span>
                <span>United States</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile;