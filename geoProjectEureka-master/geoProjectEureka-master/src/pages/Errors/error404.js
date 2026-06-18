import React from 'react';
import { useNavigate } from 'react-router-dom';
import DiffText from "../../components/DiffText/diffText";
import HeaderFake from "../../components/Header/headerFake";
import Footer from "../../components/Footer/footer";
import avatar from "../../assets/images/avatar.jpeg"

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <HeaderFake />
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              This page doesn't exist
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Well technically it does exist, but only to tell you the page you're looking for doesn't. Sorry about that.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full 
                       transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500 focus:ring-opacity-50 shadow-lg"
            >
              Go to Homepage
            </button>
          </div>
          <div className="w-64 md:w-80">
            <img
              src={avatar}
              alt="Sad pineapple character"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
      {/* <DiffText /> */}
      <Footer />
    </React.Fragment>
  );
};

export default Error404;