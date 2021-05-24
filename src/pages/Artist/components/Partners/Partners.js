import React from "react";
import "./Partners.scss";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";

function Partners() {

  return (
    <div className="partnerWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            Partners
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="partnerBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <h4 className="mb-3"><strong>Partners in crime</strong></h4>
            <p>Who's a collaborator? Anyone who's associated with this artist. Your fellow band members, a record label rep, or even your manager Collaborators with an IPI number and PRO can be attached to track uploads as writers.</p>
            <p> All of your co-writers must be invited under the Collaborators section and they must accept the agreement before your music becomes live to our classification team.</p>
            <p>We've added a section for Publishers. If you have a Publishing entity you must list it here to receive publishing royalties.</p>
            <p>Please note that you will not be able to edit a track's writers and publishers after submitting that track for classification. If needed, shoot us an email at <a href="mailto:artist@audiosocket.com">artists@audiosocket.com</a> and we'll unlock it.</p>

          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Collaborators</h2>
            <a href="" className="btn primary-btn">Add a collaborator</a>
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
              <li><a href="">Brittni Stewart <small>ade7322063, 0: SEGAC</small></a></li>
            </ul>
          </div>
        </section>
        <section className="pt-4">
          <div className="section-head">
            <h2>Publishers</h2>
            <a href="" className="btn primary-btn">Add a publisher</a>
          </div>
          <div className="partner-list">
            <ul className="partner-row">
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
              <li><a href="">Jetty Rae LLC  <small>MOSEEG 677853753</small></a></li>
            </ul>
          </div>
        </section>
    </div>
  </div>
  )
}

export default Partners;