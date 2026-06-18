import React from "react";
import logo from "../../assets/images/Siemens-logo.png"

const Footer = () => {
    return (
        <footer className="footer p-10 bg-sky-700 text-base-content mt-5">
            <aside>
                <img src={logo} className="w-72 max-w-96" alt="logo"></img>
            </aside> 
            <nav>
                <h6 className="footer-title">Company</h6> 
                <a className="link link-hover" href="">Home site</a>
                <a className="link link-hover" alt="link" href="/about-us">About us</a>
                <a className="link link-hover" alt="link" href="/contact">Contact</a>
            </nav> 
            <nav>
                <h6 className="footer-title">Legal</h6> 
                <a className="link link-hover" href="/term-of-use">Terms of use</a>
                <a className="link link-hover" href="/privacy-policy">Privacy policy</a>
                <a className="link link-hover" href="/cookie-policy">Cookie policy</a>
                <a className="link link-hover" href="/teams">Teams</a>
                <a className="link link-hover" href="*">Curious</a>
            </nav>
        </footer>
    );
}

export default Footer;