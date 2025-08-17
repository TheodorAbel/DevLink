import { useState } from "react";
import {
  FaFacebookF,
  FaGooglePlusG,
  FaLinkedinIn,
  FaHeart,
} from "react-icons/fa";

export default function AuthSlider() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f5f7] font-montserrat">
      <h2 className="text-center text-xl font-semibold mb-4">
        DEV LINK: Find Work or Hire Talent — All in One Place
      </h2>

      <div
        className={`relative w-[768px] max-w-full min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-700 ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${
            isRightPanelActive
              ? "translate-x-full opacity-100 z-10"
              : "opacity-0 z-0"
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-12 text-center w-full">
            <h1 className="font-bold text-2xl mb-2">Create Account</h1>
            <SocialIcons />
            <span className="text-sm mb-2">
              or use your email for registration
            </span>
            <input type="text" placeholder="Name" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn mt-4">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 z-10 ${
            isRightPanelActive ? "translate-x-full" : ""
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-12 text-center w-full">
            <h1 className="font-bold text-2xl mb-2">Sign in</h1>
            <SocialIcons />
            <span className="text-sm mb-2">or use your account</span>
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <a href="#" className="text-sm text-gray-600 mt-2">
              Forgot your password?
            </a>
            <button className="btn mt-4">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 z-20 ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div className="bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white h-full w-[200%] flex transition-transform duration-700">
            {/* Overlay Left */}
            <div
              className={`w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-700 ${
                isRightPanelActive ? "translate-x-0" : "-translate-x-1/5"
              }`}
            >
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="text-sm mt-2 mb-4">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="btn ghost"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right */}
            <div
              className={`w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-700 ${
                isRightPanelActive ? "translate-x-1/5" : "translate-x-0"
              }`}
            >
              <h1 className="text-2xl font-bold">Hello, Friend!</h1>
              <p className="text-sm mt-2 mb-4">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="btn ghost"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-sm text-center py-2 z-50">
        <p>
          Created with <FaHeart className="inline text-red-500" /> by{" "}
          <a
            href="https://florin-pop.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400"
          >
            Florin Pop
          </a>{" "}
          —{" "}
          <a
            href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400"
          >
            Read how I created this
          </a>
        </p>
      </footer>
    </div>
  );
}

function SocialIcons() {
  return (
    <div className="flex space-x-3 my-4">
      <a
        href="#"
        className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600"
      >
        <FaFacebookF />
      </a>
      <a
        href="#"
        className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600"
      >
        <FaGooglePlusG />
      </a>
      <a
        href="#"
        className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-gray-600"
      >
        <FaLinkedinIn />
      </a>
    </div>
  );
}
