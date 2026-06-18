import React, { useState } from 'react'
import { Link } from "react-router-dom"
import SiemensLogo from '../assets/images/Siemens-logo.png'
import useAuthentication from '../hooks/useAuthentication'
import Header from '../components/Header/header'

// Custom chevron components using SVG
const ChevronDown = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="h-5 w-5"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

const ChevronUp = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="h-5 w-5"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
)

const Section = ({ title, children, preview }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-8">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-xl text-white bg-neutral-600 p-10 rounded-t-lg hover:bg-neutral-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isOpen && (
        <div className="bg-white p-16 rounded-b-lg shadow-lg text-gray-700">
          <p className="text-lg mb-6">{preview}</p>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

const Footer = () => {
  return (
    <footer className="footer p-10 bg-sky-700 text-base-content mt-5">
      <aside> 
        <img src={SiemensLogo} className="w-72 max-w-96" alt="logo" />
      </aside> 
      <nav>
        <h6 className="footer-title">Company</h6> 
        <a className="link link-hover" href="https://vmlab.dkut.ac.ke">Home site</a>
        <Link className="link link-hover" to="/about-us">About us</Link>
        <Link className="link link-hover" to="/contact">Contact</Link>
      </nav> 
      <nav>
        <h6 className="footer-title">Legal</h6> 
        <Link className="link link-hover" to="/term-of-use">Terms of use</Link>
        <Link className="link link-hover" to="/privacy-policy">Privacy policy</Link>
        <Link className="link link-hover" to="/cookie-policy">Cookie policy</Link>
      </nav>
    </footer>
  )
}

export default function TermsOfUse() {
  const { getUserInfosFromSessionStorage } = useAuthentication()
  const userInfos = getUserInfosFromSessionStorage()

  return (
    <div className="flex flex-col min-h-screen bg-neutral-400">
      <Header connected={userInfos ? true : false} role={userInfos?.role}/>
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-bold mb-12 text-center text-neutral-800">Terms of Use</h1>

          <Section 
            title="1. Scope" 
            preview="These Terms of Use govern your access to and use of the Siemens Web Site. They outline the basic rules and requirements for using our services."
          >
            <p>1.1. Any use of this web site provided by Siemens Aktiengesellschaft and/or its affiliates ("Siemens"), "Siemens Web Site", is subject to these Terms of Use. These Terms of Use may be amended, modified or replaced by other terms and conditions, e.g. for the purchase of products and services. With log-in, or where a log-in is not required, in accessing or using the Siemens Web Site these Terms of Use are accepted in their then current version.</p>
            <p>1.2. In the case of Web offers aimed at companies or public enterprises, such companies or enterprises are represented by the user and must assume that the user has appropriate knowledge and acts accordingly.</p>
            <p>1.3. If the User uses this Siemens Web Site as business customer, i.e. that it is not acting for purposes which are outside its trade, business or profession, or as administration customer, § 312i para. 1 sentence 1 no. 1 - 3 of the German Civil Code does not apply.</p>
          </Section>

          <Section 
            title="2. Services" 
            preview="Explore our comprehensive range of services, including software downloads and documentation. Please note that service availability may vary."
          >
            <p>2.1. This Siemens Web Site contains specific information and software, as well as - as the case may be - related documentation, for viewing or downloading.</p>
            <p>2.2. Siemens may stop the operation of the Siemens Web Site in full or in part at any time. Due to the nature of the internet and computer systems, Siemens cannot accept any liability for the continuous availability of the Siemens Web Site.</p>
          </Section>

          <Section 
            title="3. Registration, Password" 
            preview="Learn about our registration process and password protection policies. We maintain strict security measures to protect user accounts."
          >
            <p>3.1. Some pages of the Siemens Web Site may be password protected. In the interest of safety and security of the business transactions, only registered Users may access said pages. Siemens reserves the right to deny registration to any User. Siemens particularly reserves the right to determine certain sites, which were previously freely accessible, subject to registration. Siemens is entitled, at any time and without obligation to give reasons, to deny the User the right to access the password-protected area by blocking its User Data (as defined below), in particular if the User</p>
            <ul className="list-disc list-inside mt-4">
              <li>uses false data for the purpose of registration;</li>
              <li>violates these Terms of Use or neglects its duty of care with regard to User Data;</li>
              <li>violates any applicable laws in accessing or using the Siemens Web Site; or</li>
              <li>did not use the Siemens Web Site for a longer period.</li>
            </ul>
          </Section>

          <Section 
            title="6. Duties of the User" 
            preview="Understand your responsibilities as a user of our platform. We maintain strict guidelines to ensure a safe and reliable environment for all users."
          >
            <p>6.1. In accessing or using the Siemens Web Site the User shall not:</p>
            <ul className="list-disc list-inside mt-4">
              <li>breach public morality in its manner of use;</li>
              <li>violate any intellectual property right or any other proprietary right;</li>
              <li>upload any contents containing a virus, so-called Trojan Horse, or any other program that could damage data;</li>
              <li>transmit, store or upload hyperlinks or contents to which the User is not entitled, in particular in cases where such hyperlinks or contents are in breach of confidentiality obligations or unlawful; or</li>
              <li>distribute advertising or unsolicited e-mails (so-called "spam") or inaccurate warnings of viruses, defects or similar material and the User shall not solicit or request the participation in any lottery, snowball system, chain letter, pyramid game or similar activity.</li>
            </ul>
            <p className="mt-4">6.2. Siemens may deny access to the Siemens Web Site at any time, in particular if the User breaches any obligation arising from these Terms of Use.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  )
}