import React from "react";
import { motion } from "framer-motion";

const ClientForm = () => {
  return (
    <motion.section
      className="py-16 px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center -mt-6">
        Client Request Form
      </h2>

      <form className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
          />
        </div>

        {/* Service Type (Combo Box) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Service Type
          </label>
          <select
            defaultValue=""
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black transition text-gray-700"
          >
            <option value="" disabled>
              Select a service
            </option>
            <option>Web Development</option>
            <option>Mobile App Development</option>
            <option>UI/UX Design</option>
            <option>SEO & Digital Marketing</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Message / Requirements
          </label>
          <textarea
            rows="4"
            placeholder="Describe your project or requirements..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="border-2 border-primary bg-primary text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-transparent hover:text-primary hover:scale-105"
          >
            Submit Request
          </button>
        </div>
      </form>
    </motion.section>
  );
};

export default ClientForm;
