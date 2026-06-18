import React, { useState } from 'react'
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
        <h6 className="footer-title text-gray-200 text-2xl">Company</h6>
        <a className="link link-hover text-gray-200 text-2xl" href="https://vmlab.dkut.ac.ke">Home site</a>
        <Link className="link link-hover text-gray-200 text-2xl" to="/about-us">About us</Link>
        <Link className="link link-hover text-gray-200 text-2xl" to="/contact">Contact</Link>
      </nav>
      <nav>
        <h6 className="footer-title text-gray-800 text-2xl">Legal</h6>
        <Link className="link link-hover text-gray-200 text-2xl" to="/term-of-use">Terms of use</Link>
        <Link className="link link-hover text-gray-200 text-2xl" to="/privacy-policy">Privacy policy</Link>
        <Link className="link link-hover text-gray-200 text-2xl" to="/cookie-policy">Cookie policy</Link>
      </nav>
    </footer>
  )
}

export default function CookiePolicy() {
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
        <h1 className="text-5xl font-bold mb-8">Cookie Policy</h1>
        <p className="mb-6 text-2xl">Effective Date: {new Date().toLocaleDateString()}</p>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-6">1. Introduction</h2>
          <p className="text-2xl leading-relaxed">
            This Cookie Policy explains how Eureka Geothermal Energy Project ("we", "our", or "us") uses cookies and similar technologies when you visit our website. This policy should be read alongside our Privacy Policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-6">2. What Are Cookies</h2>
          <p className="text-2xl leading-relaxed">
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better website experience and allow certain features to function properly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-6">3. Types of Cookies We Use</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-2xl">Essential Cookies</h3>
              <p className="text-2xl leading-relaxed">These cookies are necessary for the website to function properly and cannot be disabled.</p>
            </div>
            <div>
              <h3 className="font-semibold text-2xl">Analytics Cookies</h3>
              <p className="text-2xl leading-relaxed">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            </div>
            <div>
              <h3 className="font-semibold text-2xl">Functional Cookies</h3>
              <p className="text-2xl leading-relaxed">Enable enhanced functionality and personalization, such as remembering your preferences.</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-6">4. Third-Party Cookies</h2>
          <p className="text-2xl leading-relaxed">We may use third-party services that place cookies on your device, including:</p>
          <ul className="list-disc pl-6 mt-4 text-2xl leading-relaxed">
            <li>Google Analytics (for website analytics)</li>
            <li>Social media plugins (for content sharing)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-10">5. Managing Cookies</h2>
          <p className="text-2xl leading-relaxed">You can control and/or delete cookies as you wish by:</p>
          <ul className="list-disc pl-6 mt-4 text-2xl leading-relaxed">
            <li>Changing your browser settings to reject cookies</li>
            <li>Deleting all cookies stored in your browser</li>
            <li>Using our cookie consent tool when available</li>
          </ul>
          <p className="mt-4 text-2xl leading-relaxed">
            Note that disabling certain cookies may impact the functionality of our website.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-6">6. Updates to This Policy</h2>
          <p className="text-2xl leading-relaxed">
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Effective Date" at the top.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-4xl font-semibold mb-10">7. Contact Us</h2>
          <p className="text-2xl leading-relaxed">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <address className="mt-10 not-italic text-2xl leading-relaxed">
            Eureka Geothermal Energy Project<br />
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