import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div className="footer-section">
                <div className="column1">
                    <h1 className="footer-title">MANGOFLIX</h1>
                    <div className="footer-links">
                        <a href="mailto:jonathan.zhou2@student.tdsb.on.ca">Email</a><br />
                        <a href="https://github.com/Jonnyoo">Github</a><br />
                        <a href="https://classroom.google.com/u/0/c/NzA1NDQyODkyNTUw">Classroom</a>
                    </div>
                </div>
                <div className="column2">
                    <h1 className="footer-signup-title">Sign Up Now</h1>
                    <div className="footer-email">
                        <input className="footer-email-input" type="email" placeholder="Email..." />
                        <button className="footer-getstarted-button"><Link to={`/register`} className="footer-getstarted-button">Sign Up</Link></button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;