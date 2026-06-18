import React, { useState, Fragment } from "react";
import Header from "../components/Header/header";
import Footer from "../components/Footer/footer";

const ContactsPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For a simple 'mailto' form submission (opens email client)
        window.location.href = `mailto:kamalikinuthia3@gmail.com?subject=Message from ${formData.name}&body=${formData.message}`;
    };

    return (
        <Fragment>
            <Header />
            <div className="bg-gray-100 py-12">
                <div className="container mx-auto px-6 lg:px-8">
                    {/* Contact Information */}
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
                        <p className="text-lg text-gray-600 mt-4">
                            We’d love to hear from you! Whether you have a question or just want to chat.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Contact Details */}
                        <div className="flex flex-col space-y-6">
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8c0-1.104-.895-2-2-2H6c-1.105 0-2 .896-2 2v8c0 1.104.895 2 2 2h8c1.105 0 2-.896 2-2V8zM8 10v6m4-6v6M12 10v6m-4-2v-2m4 2v-2" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Our Office</h3>
                                    <p className="text-gray-500">DeKUT Main Campus</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.12 7.12a4 4 0 015.76 0M4.222 10.222a8 8 0 0111.556 0m-3.024 1.024a10 10 0 00-5.268 5.268m5.268-5.268a10 10 0 000-14.08M15 12v3m0 0v.01" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Call Us</h3>
                                    {/* Call link */}
                                    <a href="tel:+254769492324" className="text-blue-500 hover:underline">
                                        +254769492324
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v4H4V4zm16 8v8H4v-8h16zm0 0H4m12 4v4" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Email Us</h3>
                                    {/* Email link */}
                                    <a href="mailto:kamalikinuthia3@gmail.com" className="text-blue-500 hover:underline">
                                        siemens@dkut.ac.ke
                                    </a>
                                </div>
                            </div>

                            
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v4H4V4zm16 8v8H4v-8h16zm0 0H4m12 4v4" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Whatsapp</h3>
                                    {/* Whatsapp */}
                                    <a href="mailto:kamalikinuthia3@gmail.com" className="text-blue-500 hover:underline">
                                        Whatsapp
                                    </a>
                                </div>
                            </div>

                            
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v4H4V4zm16 8v8H4v-8h16zm0 0H4m12 4v4" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">LinkedIn</h3>
                                    {/* LinkedIn link */}
                                    <a href="mailto:kamalikinuthia3@gmail.com" className="text-blue-500 hover:underline">
                                        LinkedIn
                                    </a>
                                </div>
                            </div>

                            
                            <div className="flex items-center space-x-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v4H4V4zm16 8v8H4v-8h16zm0 0H4m12 4v4" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">X</h3>
                                    {/* Twitter link */}
                                    <a href="mailto:kamalikinuthia3@gmail.com" className="text-blue-500 hover:underline">
                                        X
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                        placeholder="Enter your name" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                        placeholder="Enter your email" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                        rows="4" 
                                        placeholder="Your message here"
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200" 
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default ContactsPage;
