import React, {Component} from 'react';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <ul>
            <li><a href="https://www.gov.bc.ca/">Home</a></li>
            <li><a href="https://www.gov.bc.ca/">Disclaimer</a></li>
            <li><a href="http://gov.bc.ca/privacy">Privacy</a></li>
            <li><a href="http://gov.bc.ca/webaccessibility">Accessibility</a></li>
            <li><a href="http://gov.bc.ca/copyright">Copyright</a></li>
            <li><a href="https://www2.gov.bc.ca/gov/content/home/contact-us">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    );
  }
}

export default Footer;
