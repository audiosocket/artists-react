import React from "react";
import {Accordion, Card, Button, Breadcrumb} from 'react-bootstrap';
import {Route, Switch, NavLink} from "react-router-dom";
import artwork from "../../../../images/artwork.jpg";

function Album({id = null}) {
  return (
    
    <div className="albumsWrapper">
      <div className="asBreadcrumbs">
        <Breadcrumb>
          <Breadcrumb.Item href="#">Listing</Breadcrumb.Item>
          <Breadcrumb.Item active href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
            Albums
          </Breadcrumb.Item>
          <Breadcrumb.Item>Track</Breadcrumb.Item>
        </Breadcrumb>
        <div className="section-content">
          <section >
            <div className="section-head">
              <h2>Album {id}</h2>
              <div className="sec-controls">
                <NavLink to="/profile/edit" className="btn primary-btn mr-2">Edit</NavLink>
                <NavLink to="/profile/edit" className="close-btn btn btn-light">Delete</NavLink>
              </div>
            </div>
            <div className="section-body">
              <div className="bg-content yellow bgSecondVersion">
                <p>Please make sure you edit your track metadata carefully, make sure it looks the way you'd like it to be seen in the player. Once you upload music and assign writers to the tracks, please remember to check the blue "Submit To Classification" button on each track and the music will become available to our team for review. If you forget this part, your music will not be available to us.</p>
                <p className="mb-0">Original material only please! We do not accept cover songs or songs containing samples. Unless it's public domain, you and your collaborators must own all the copyrights to the music you're submitting.</p>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <div className="section-head">
              <h2>Artwork</h2>
              <NavLink to="/profile/edit" className="btn primary-btn">Edit</NavLink>
              <p className="sec-head-para mb-0">Time to add some artwork to this album! Click the Edit button above to get started.</p>
            </div>
            <div className="section-body">
              <div className="artwork-images-sec">
                <div className="artwork-image">
                  <img src={artwork} alt="Artwork"/>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-4">
            <div className="section-head">
              <h2>Tracks</h2>
            </div>
            <div className="section-body">
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Click me!
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>Hello! I'm the body</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Click me!
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </section>
        </div>
      </div>

    </div>
  )
}

export default Album;