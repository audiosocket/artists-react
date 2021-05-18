import React from "react";
import "./Agreements.scss";

function Agreements() {

  return (
    <div className="agreementWrapper">
      <h2>Agreements</h2>
      <div className="agreementBody">
        <section>
          <div className="bg-content yellow bgSecondVersion mt-4">
            <p>YouTube requires artists elect only one administrator when managing your recordings on their platform. To be made available for all Audiosockel opportunities, we need to be your administrator so our clients who are licensing your music are not being sent copyright Infringement claims from other companies.</p>
            <p>If you already have an agent, you must opt out of our YouTube portion of the agreement. This will provent your music from being made available for digital and web media opportunities since wo are not able to contest claims that are made on the YouTube platform by other administrators. If
            you are unsure, or would like more information, please email <a href="mailto:artist@audiosocket.com">artists@audiosocket.com</a>.</p>
          </div>
        </section>

        <section className="pt-4">
          <h2>YouTube Content ID Agreement</h2>
          <div className="agreementContent mt-3">
            <p>Clause 100 of the Audicsocket Artist Agreement states Audiosocket has the exclusive night to administer the YouTube Content ID program on your behalf. You may opt out of this clause the Audiosocket Artist Agreement by clicking on the button below.</p>
            <p>Please sue the FAQ for additional details on the YouTube Content ID Program.</p>
          </div>
          <div className="agreementContentController">
            <button className="btn primary-btn">I wish to opt-out of this agreement.</button>
            <a href="" download>Download PDF</a>
          </div>
        </section>

        <section className="pt-4">
          <h2>Artist Agreement</h2>
          <div className="agreementContent mt-3">
            <p>When planning an exhibition, whether it be a temporary or travelling one, it is essential to have a written agreement or contract with contributing organisations, artists and presenters. The agreement or contract is the legal document between an artist or owner of an artwork and a borrowing institution, or between an exhibition organiser and the host venue.</p>
            <p>They are written to specify details about work to be undertaken and the expected outcomes. Formal agreements give both parties a clear point of reference as to their individual duties and responsibilities.</p>
            <p>Clause 100 of the Audicsocket Artist Agreement states Audiosocket has the exclusive night to administer the YouTube Content ID program on your behalf. You may opt out of this clause the Audiosocket Artist Agreement by clicking on the button below.</p>
          </div>
          <div className="agreementContentController">
            <button className="btn primary-btn">I wish to opt-out of this agreement.</button>
            <a href="" download>Download PDF</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Agreements;