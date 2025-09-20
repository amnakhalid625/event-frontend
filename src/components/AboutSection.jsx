import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src="/public/about.jpg"
              alt="About Us"
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className=" font-semibold text-lg mb-2">Since 1988</h4>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Our Story
            </h2>
            <p className="text-gray-600 mb-4">
              We started with a vision to bring impactful solutions to businesses
              worldwide. Over the years, our passion for excellence and 
              innovation has guided us through every challenge.
            </p>

            <ul className="space-y-2 mb-4 text-gray-600">
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle "></i>
                <span>Providing innovative digital solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle "></i>
                <span>Trusted by hundreds of global clients</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle "></i>
                <span>Building long-term value & partnerships</span>
              </li>
            </ul>

            <p className="text-gray-600 mb-6">
              Our commitment to quality and client satisfaction continues 
              to drive our journey forward, shaping the future together.
            </p>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
            >
              <PlayCircle size={28} className="text-secondary" />
              Watch Video
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
