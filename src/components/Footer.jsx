import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-t  ">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Company Info Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Kaboozat</h3>
            <p className="text-gray-600 mb-5">
              Digital solutions for business growth and success.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-secondary transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'Services',
                'About Us',
                'Contact',
                'FAQ'
              ].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-600 hover:text-secondary transition">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                <p className="text-gray-600">607 Shelby St, Detroit, MI 48226</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-3" />
                <p className="text-gray-600">+1 616 274-3853</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <p className="text-gray-600">info@kaboozat.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Kaboozat. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-2 text-sm text-gray-500">
            <Link to="#" className="hover:text-secondary transition">Privacy</Link>
            <span>•</span>
            <Link to="#" className="hover:text-secondary transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;