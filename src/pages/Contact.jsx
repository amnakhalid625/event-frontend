import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import lootiee from '../animation/myAnimation.json';
import {
  FiMail,
  FiPhone,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin
} from 'react-icons/fi';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-5xl mx-auto my-10 px-4"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          Let's Connect and Start Your Digital Journey
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Let's connect and ignite your business success! Reach out to Biz.Tech.Mgt and learn how our expert web design, marketing, and growth solutions can take your business to the next level.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Left Side - Contact Info */}
        <div className="w-full md:w-1/2 space-y-6 px-4 mt-[-50px]">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }}
            className="mb-8"
          >
            <Lottie
              animationData={lootiee}
              loop={true}
              className="w-full h-[280px] sm:h-[430px]"
            />
          </motion.div>

          {/* <div className="space-y-4 bg-white py-6 px-3 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded-full">
                <FiMail className="text-primary text-[14px]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Email:</h3>
                <a
                  href="mailto:contact@company.com"
                  className="text-gray-800 hover:text-primary transition-colors text-sm"
                >
                  Info@biztechmgt.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded-full">
                <FiPhone className="text-primary text-[14px]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Phone:</h3>
                <a
                  href="tel:+1123123321323"
                  className="text-gray-800 hover:text-primary transition-colors text-sm"
                >
                  +1 616 274-3853
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Reach out to us on:</h3>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="group p-2.5 bg-[#1DA1F2] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-3">
                  <FiTwitter className="text-white text-lg group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="group p-2.5 bg-[#1877F2] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-3">
                  <FiFacebook className="text-white text-lg group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="group p-2.5 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-2">
                  <FiInstagram className="text-white text-lg group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="group p-2.5 bg-[#0077B5] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-2">
                  <FiLinkedin className="text-white text-lg group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Side - Form */}
        <motion.div
          className="w-full md:w-1/2 bg-white p-5 sm:p-6 rounded-lg shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Your phone"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                placeholder="Write your message here..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>

      {/* Google Map Section */}
      <section className="mt-16">
       <h1 className="text-3xl md:text-4xl font-bold text-primary text-center">
        Our Office Location
        </h1>
        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-md mt-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2949.620589049637!2d-83.0509673240706!3d42.329290571195756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d3aeb1d6cef%3A0x5cb331097060cfe4!2s607%20Shelby%20St%20Suite%20700%2C%20Detroit%2C%20MI%2048226%2C%20USA!5e0!3m2!1sen!2s!4v1748935035837!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map - Office Location"
          ></iframe>
        </div>
      </section>


    </motion.div>

    </>
  );
};

export default Contact;
