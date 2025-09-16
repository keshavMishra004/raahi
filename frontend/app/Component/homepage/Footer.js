import React from 'react'
import '../../css/footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <section className="footer">
        <div className="footer-content">
            <div className="footer-row-1">
            <div className="footer-logo-col">
                <div className="footer-logo">
                <span className="footer-logo-icon">&#9679;</span>
                <span className="footer-logo-text">RAAHi</span>
                </div>
                <div className="footer-tagline">Discover. Book. Fly</div>
            </div>
            </div>
            <div className="footer-row-2">
            <div className="footer-links">
                <div className="footer-col featured">
                <h4>FEATURED</h4>
                <ul>
                    <li>Private Charter</li>
                    <li>Air Ambulance</li>
                    <li>Empty leg</li>
                    <li>Aerial Activities</li>
                    <li>Pilgrimage Flights</li>
                </ul>
                </div>
                <div className="footer-col">
                <h4>CHARTER</h4>
                <ul>
                    <li>Private Charters</li>
                    <li>Air Ambulance</li>
                    <li>Empty Leg</li>
                </ul>
                </div>
                <div className="footer-col">
                <h4>AERIAL SERVICES</h4>
                <ul>
                    <li>Skydiving</li>
                    <li>Paragliding</li>
                    <li>Hang Gliding</li>
                    <li>Aerobatics Flights</li>
                    <li>Helicopter Tours</li>
                    <li>Gliding</li>
                    <li>Hot Air Balloon</li>
                    <li>Wingsuit Flying</li>
                </ul>
                </div>
                <div className="footer-col">
                <h4>SUPPORT</h4>
                <ul>
                    <li>Help</li>
                    <li>Privacy Policy</li>
                    <li>Terms & Conditions</li>
                    <li>FAQ</li>
                </ul>
                </div>
            </div>
            <div className="footer-social">
                <div className="footer-social-text">Board with us online!</div>
                <div className="footer-social-icons">
                <a href="#" aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} style={{fontSize: '2rem'}} /></a>
                <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} style={{fontSize: '2rem'}} /></a>
                <a href="#" aria-label="X"><FontAwesomeIcon icon={faXTwitter} style={{fontSize: '2rem'}} /></a>
                </div>
            </div>
            </div>
        </div>
        <div className="footer-copyright">
            &copy; 2025 RAAHi. Making charter and non-scheduled flights discoverable across India.
        </div>
    </section>
  )
}

export default Footer