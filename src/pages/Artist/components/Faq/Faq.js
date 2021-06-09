import React, {useContext} from "react";
import "./faq.scss";
import {ReactComponent as ArrowUp } from '../../../../images/arrow-up.svg';
import {ReactComponent as ArrowDown } from '../../../../images/arrow-down.svg';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import AccordionContext from 'react-bootstrap/AccordionContext'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import Breadcrumb from "react-bootstrap/Breadcrumb";
import {NavLink} from "react-router-dom";

function ContextAwareToggle({ children, eventKey, callback }) {
	const currentEventKey = useContext(AccordionContext);

	const decoratedOnClick = useAccordionToggle(
		eventKey,
		() => callback && callback(eventKey),
	);

	const isCurrentEventKey = currentEventKey === eventKey;

	return (
		<Card.Header className={isCurrentEventKey ? "active" : ""}>
			<button
				type="button"
				style={{ backgroundColor: isCurrentEventKey ? '' : '' }}
				className={isCurrentEventKey ? "active" : ""}
				onClick={decoratedOnClick}
			>
				{children}
				<span className={!isCurrentEventKey ? "arrow-down active" : "arrow-down"}><ArrowDown /></span>
				<span className={isCurrentEventKey ? "arrow-up active" : "arrow-up"}><ArrowUp/></span>
			</button>
		</Card.Header>
	);
}

function Faq () {
	return(
		<div className="faq-block">
			<div className="asBreadcrumbs">
				<Breadcrumb>
					<li className="breadcrumb-item">
						<NavLink to="/">Home</NavLink>
					</li>
					<li className="breadcrumb-item active">
						FAQs
					</li>
				</Breadcrumb>
			</div>
			<div className="section-head">
				<h2 className="pt-0">Frequently Asked Questions</h2>
			</div>
			<Accordion defaultActiveKey="0">
				<Card>
					<ContextAwareToggle eventKey="1">
						Welcome! You’re officially in! Here’s some info on what’s next and what to expect.
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							Once your music is uploaded and approved, it’s tagged with over 200 unique attributes including genre, mood, instrumentation, themes, bpm, key, and more.
							<br/>
							<br/>
							Our creative team listens to new music and adds to our Curated Playlist page. Your music becomes live in the player and is searchable by clients as well as our creative music supervisors and sales team.
							<br/>
							<br/>
							We service briefs daily for all types of sync opportunities. Have an idea where you think your music is perfect for? Let us know! We’re all ears.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="1.1">
						What should I include on my Artist Info Page?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="1.1">
						<Card.Body>
							Please include a cover photo and a banner image. Keep in mind with the banner there will be text overlaid so a textural or simple color background image is ideal. Image specs are x for cover photo, x for banner. These images will appear on the front end so choose wisely. Color images are best.
							<br/>
							<br/>
							Please include a short bio (think elevator pitch!) Please include your social media handles. Keep us posted for any great artist bits we can use to promote you! Land a Spotify playlist add? Playing a really cool well known venue? Have a new music video? Let us know!
							<br/>
							<br/>
							[Info needed on functionality]
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="2">
						How do I unlock my Artist Info page?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="2">
						<Card.Body>
							Artist pages are locked once info is submitted, our team will review photos and bios before approving. Need it unlocked? Hit us up.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="3">
						I have co-writers or rights-holders, how do I invite them?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="3">
						<Card.Body>
							Under the Collaborators section, please invite ALL rights-holders. Enter their name and email. It will invite them to your artist portal where they can review and accept the agreement. All parties must sign off before we can start working with your music. Please make sure they enter their Performing Rights information as they have it registered in ASCAP or BMI, etc.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="4">
						What’s a CAE/IPI and do I really need it?
						<br/>
						Will I be accepted?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="4">
						<Card.Body>
							Yes! Think of it like your personal writer tracking number. It’s unique and will allow you to receive writer royalties should your music land something bearing royalties like a tv show! You can find it by logging into your PRO account, it’s 9 digits long (this is not your member ID number.)
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="5">
						Where do I list my publishing entity?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="5">
						<Card.Body>
							Under the Collaborators section, please list your publishing entity name as registered with your PRO. Each co-writer should have a publishing entity.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="6">
						How do I upload music?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="6">
						<Card.Body>
							On the Music tab, please create a new Album. Albums can be collections of tracks, a single track, EP or an actual album. Upload the tracks and assign your collaborators. Please note, all collaborators must sign off on the agreement before you can submit the tracks.
							<br/>
							<br/>
							We invite you to also submit album artwork. If you don’t have album art, check out apps like Canva for easy drag and drop graphic design templates. Otherwise, color images work.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="7">
						Do you take covers?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="7">
						<Card.Body>
							We do not accept covers or music with samples. You must own/control 100% of your music.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="8">
						What type of files are you looking for?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="8">
						<Card.Body>
							44K WAV or AIFF are welcome.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="9">
						What type of music are you looking for?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="9">
						<Card.Body>
							We look for high quality, high production value, relevant sounds, universal lyrics and music written with sync in mind. Watch our newsletters for tips and tricks on how to increase your chances for sync! [If there’s a blog post on this topic we can link it here]
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="10">
						Should I include lyrics?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="10">
						<Card.Body>
							Yes, please provide your lyrics. Please make sure they’re grammatically correct. Help us make you look good!
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="11">
						Can I submit explicit tracks?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="11">
						<Card.Body>
							Yes, but please mark them as explicit and please include a clean version. TV supervisors require this. Explicit doesn’t have to be swearing, lyrical content can be as well. If you have questions, let us know.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="12">
						Should I include stems or alternate versions?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="12">
						<Card.Body>
							We welcome this. We can nest your stems. Otherwise, please make sure they're available if we reach out. Average turnaround time on stem requests are typically an hour. Please name your stems appropriately. <i>Example: Song Name - Guitar - Stem, Song Name - Drums - Stem.</i>
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="13">
						When do you send payments?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="13">
						<Card.Body>
							We send payments biannually in February and August for non exclusive tracks, monthly for exclusive tracks. If you’re interested in hearing more about our exclusive program, please let us know.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="14">
						Will you pay my co-writers?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="14">
						<Card.Body>
							We offer payment to one payee per artist entity. That payee is responsible for paying splits.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="15">
						Where can I see my licensing stats?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="15">
						<Card.Body>
							We don’t offer stats in our current iteration, but plan to in future versions.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="16">
						How do I download my artist statements?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="16">
						<Card.Body>
							[Info needed on functionality]
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<h5 className="end-note">Any other questions? Please feel free to contact us at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a></h5>
		</div>
	);
}

export default Faq;
