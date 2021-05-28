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
		<Card.Header className={isCurrentEventKey && "active"}>
			<button
				type="button"
				style={{ backgroundColor: isCurrentEventKey ? '' : '' }}
				className={isCurrentEventKey && "active"}
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
						When will I know if you accept my audition or not?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							We’ll get back to you within 90 days. We appreciate your patience: We want to give your music the good, hard listening it deserves.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="1.1">
						I’m an Audiosocket artist. Do I need to go through Auditions again?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="1.1">
						<Card.Body>
							If you’re an Audiosocket artist, please send us a link to your music to <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a>. We've become more selective with what we take on, adding music in sounds our clients are asking for. You can check out some of our recent <a href="https://www.youtube.com/playlist?list=PL8474481F2967477D" target="_blank">work</a> if it's helpful to see the types of songs we're placing. We’ll let you know our decision as soon as possible.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="2">
						I’d like to submit more music. Do I have to wait for your reply?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="2">
						<Card.Body>
							We ask that you only submit your best 4 tracks. If you create music in other genres or under another artist name, you can make a new submission for that artist. Please allow up to 90 days from your submission to add new music or wait for our reply.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="3">
						I have submitted music but haven’t heard from you yet...
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="3">
						<Card.Body>
							We are working to review all auditions in a timely manner while we carefully review all music submitted to us. Note that some of our replies land on the spam folders.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="4">
						I’ve submitted music twice and have been rejected, even though it meets your most recent work.
						<br/>
						Will I be accepted?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="4">
						<Card.Body>
							We truly appreciate your interest in working with us! As we work with the best indie musicians in the industry, our acceptance rate is very low. We like to offer the best quality to our clients, hence we not only review based on our current needs but also composing and songwriting quality. We welcome you to submit your best new tracks again!
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="5">
						What is Audiosocket known for?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="5">
						<Card.Body>
							Audiosocket is an established and respected music licensing company known for offering one of the most diverse rosters, with over 80,000 songs from more than 2000 artists across 200 genres.
							<br/><br/>
							We are known for a high quality, curated pre-cleared roster and have earned a great reputation in the relationships with our artists.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="6">
						What are Audiosocket’s typical sync placements?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="6">
						<Card.Body>
							We work with a large variety of clients. We offer licenses for that range from hobbyist home videos, social influencers, small businesses, indie films, up to TV advertisements, TV Series, Film trailers, games, brand partnerships and more. There are some big names within our client list, including HBO, Lionsgate, Hulu, Lexus, Amazon, Disney+ and Netflix; you can find our most recent placements <a href="https://www.youtube.com/user/audiosocket" target="_blank">here</a>.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="7">
						What’s the deal?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="7">
						<Card.Body>
							We offer a 65/35 deal. Audiosocket commissions 65% of the gross licensing fee and publishing royalties, but the composers keep 100% of the writer's share.
							<br/>
							If you’re selected to be part of our premium catalog, we’d offer an exclusive agreement with a 50/50 split. The exclusive agreement comes with additional benefits such as monthly payments, quarterly pitch updates and more.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="8">
						Who retains the copyrights?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="8">
						<Card.Body>
							Writers retain 100%.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="9">
						My music has samples and I have signed licenses authorizing these.
						<br/>
						Can I submit these tracks to Audiosocket?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="9">
						<Card.Body>
							Unfortunately we do not accept samples music or cover tracks.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="10">
						I’d like to be considered for Audiosocket’s exclusive catalog only.
						<br/>
						What’s the best way to tell you this?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="10">
						<Card.Body>
							Thank you for your interest in being part of ASX, our exclusive arm. There are no auditions for this but, if your music is accepted to Audiosocket, you can then let us know you’d like to be considered for an ASX. This is a very small collection, meaning that your music needs to be truly next level! If this is the case and it meets our current needs, you’ll likely be invited!
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="11">
						What else do you offer to Audiosocket artists?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="11">
						<Card.Body>
							We invest a good bit in your music up front, from ingestion, tagging, playlisting, and marketing. We offer unique opportunities for our artists, from playlist curation on our website to social media marketing, from songwriting competitions to digital distribution. The list increases for exclusive artists but we work with everyone from our creative community from within, always aiming to make the most of your music!
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="12">Can I work with other music licensing companies?</ContextAwareToggle>
					<Accordion.Collapse eventKey="12">
						<Card.Body>
							If you’re offered a non-exclusive agreement, yes. While we are non-exclusive we do suggest you review other licensing companies pricing models as we have seen some recent companies offering all you can eat subscriptions at very low prices and that does not offer artists a sustainable career. We encourage you to do this research so that you're not competing with yourself. Clients do price shop and may find it cheaper somewhere else.
							<br/>
							Please note that we no longer accept or represent non-exclusive tracks that are also represented by Artlist or SoundStripe.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="13">
						I’m not registered with a PRO, do I need to? Will you register my tracks?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="13">
						<Card.Body>
							We do recommend signing up for a PRO (Performing Rights Organization) like ASCAP, BMI or SESAC if you're going to be licensing your music. If your music lands in something royalty bearing, it’ll receive writer and publishing royalties for it airing and you'll potentially be losing out on a good bit of revenue. We recommend registering your music but you can do so in tandem with us ingesting your music and assets.
						</Card.Body>
					</Accordion.Collapse>
				</Card>

				<Card>
					<ContextAwareToggle eventKey="14">
						Do you need to administer my copyright on YouTube?
					</ContextAwareToggle>
					<Accordion.Collapse eventKey="14">
						<Card.Body>
							We prefer to admin because we have auto whitelisting tech in place for the tracks we admin in <a href="https://blog.audiosocket.com/demystifying-youtube-content-id-why-it-is-good-for-creators/" target="_blank">YouTube Content ID</a>. It's disruptive to our business when clients license music and receive claims from other companies. Unfortunately we are not currently accepting music with CID managed by 3rd parties. We can offer the same service and a 75/25 split your favor for CID, while keeping our clients happy.
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<h5 className="end-note">Any other questions? Please feel free to contact us at <a href="mailto:artists@audiosocket.com">artists@audiosocket.com</a></h5>
		</div>
	);
}

export default Faq;
