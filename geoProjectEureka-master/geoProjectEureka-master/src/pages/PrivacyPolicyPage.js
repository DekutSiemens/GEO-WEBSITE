import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import SiemensLogo from '../assets/images/Siemens-logo.png'
import useAuthentication from '../hooks/useAuthentication'
import Header from '../components/Header/header'

const Footer = () => {
  return (
    <footer className="footer p-10 bg-sky-700 text-gray-800 mt-5">
      <aside>
        <img src={SiemensLogo} className="w-72 max-w-96" alt="logo" />
      </aside>
      <nav>
        <h6 className="footer-title text-gray-200">Company</h6>
        <a className="link link-hover text-gray-200" href="https://vmlab.dkut.ac.ke">Home site</a>
        <Link className="link link-hover text-gray-200" to="/about-us">About us</Link>
        <Link className="link link-hover text-gray-200" to="/contact">Contact</Link>
      </nav>
      <nav>
        <h6 className="footer-title text-gray-200">Legal</h6>
        <Link className="link link-hover text-gray-200" to="/term-of-use">Terms of use</Link>
        <Link className="link link-hover text-gray-200" to="/privacy-policy">Privacy policy</Link>
        <Link className="link link-hover text-gray-200" to="/cookie-policy">Cookie policy</Link>
      </nav>
    </footer>
  )
}

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const { getUserInfosFromSessionStorage } = useAuthentication()
  const userInfos = getUserInfosFromSessionStorage()

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col min-h-screen bg-grey-900">
      <Header connected={userInfos ? true : false} role={userInfos?.role} />
      <main className="flex-grow container mx-auto px-4 py-10 text-black">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Effective Date: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Eureka Geothermal Energy Project, its subsidiaries and affiliates ("Eureka Geothermal", "we", "our", and/or "us") are committed to upholding the privacy rights of individuals ("you", "Users"). This Privacy Policy explains our policies and procedures regarding the collection, use, and disclosure of Personal Information from Users of our website and related services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We may collect the following types of Personal Information:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Contact information (e.g., name, email address, phone number)</li>
            <li>Professional information (e.g., job title, company name)</li>
            <li>Technical information (e.g., IP address, device information)</li>
            <li>Usage information related to your interactions with our services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information for purposes including:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Providing and improving our services</li>
            <li>Communicating with you about our services and updates</li>
            <li>Conducting research and analysis</li>
            <li>Ensuring compliance with applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">4. Sharing of Information</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Our affiliates and partners (e.g., Dedan Kimathi University of Technology)</li>
            <li>Service providers and contractors</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">5. Your Rights and Choices</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your Personal Information</li>
            <li>Correct inaccuracies in your Personal Information</li>
            <li>Delete your Personal Information</li>
            <li>Object to or restrict the processing of your Personal Information</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
          <p>
            We implement reasonable security measures to protect your Personal Information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="mt-2 not-italic">
            Eureka Geothermal Energy Project<br />
            [Your Address]<br />
            Email: siemens@dkut.ac.ke
          </address>
        </section>

        <div className="mt-12 mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center px-4 py-2 border border-teal-800 rounded-md shadow-sm text-sm font-medium text-teal-800 bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}