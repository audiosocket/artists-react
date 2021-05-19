import React from "react";
import "./Welcome.scss";
import {Link} from "react-router-dom";

function Welcome() {

  return (
    <div className="welcome-content">
      <section>
        <h3><strong>What happens now?</strong></h3>
        <h5><strong>Good question! Try these on for size:</strong></h5>
        <ul>
          <li>Read the Getting paid section below and send us your info via mail or scan.</li>
          <li>Tell us more about you. We need your phone number and address so we can keep in touch! Click <Link to="/profile">Artist</Link> to the left.</li>
          <li>Add collaborators for this artist. Collaborators are your writer, record label reps, managers and publishers. You have to invite all the writers and they must accept contract terms before we can accept your music in our catalogue. To do so, click on <Link to="/partners">Partners</Link> to the left.</li>
          <li>Upload some music! Our crack team of musicologists will carefully evaluate it as soon as they can. Click <Link to="/music">Music</Link> to the left.</li>
        </ul>
      </section>

      <section>
        <h3><strong>Question?</strong></h3>
        <h5><strong>If you have any questions or suggestions, please send us an email at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>.</strong></h5>
        <div className="bg-content yellow">
          <div className='sub-section'>
            <h4><strong>Getting Paid</strong></h4>
            <p>Wo love giving artists money, but there are some important documonts we need before we can make that happen. </p>
            <p>First, make sure that you have completely and correctly filled in your payeo information.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>US citizens</strong></h4>
            <p>We need one W-9 form on file per artist. If you are an existing artist and have already sent us one, you do not need to send another.</p>
            <p>Please <a href="">download from the IRS</a>, fill it out and sign it. You can either mail the completed form to us at the address below, or <a href="mailto:accounting@audiosocket.com">accounting@audiosocket.com</a>. Please include your artist namel</p>
            <p>If you don't send one we must withhold 28% of all future payments for tax purposes, so it's very important.</p>
          </div>

          <div className='sub-section'>
            <h4><strong>International artists</strong></h4>
            <p>Taxos are a little more complicated for you, so we've <a href="">written a document</a> to help you through the process. It may soom like a hassle, but once it's done you'll thank us for not retaining 28% of your sync revenue!</p>
          </div>

          <div className='sub-section our-address'>
            <h4><strong>Our address</strong></h4>
            <p><small>audiosocket</small></p>
            <p><small>3518 Fremont Ave N #400</small></p>
            <p><small>Seattle, WA 98103</small></p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Welcome;