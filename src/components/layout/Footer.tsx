'use client';

import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 relative w-full border-b border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12"
        style={{
            background: 'transparent url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><circle cx=\'10\' cy=\'10\' r=\'0.5\' fill=\'white\' opacity=\'0.8\'/><circle cx=\'30\' cy=\'20\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/><circle cx=\'60\' cy=\'15\' r=\'0.4\' fill=\'white\' opacity=\'0.9\'/><circle cx=\'80\' cy=\'25\' r=\'0.2\' fill=\'white\' opacity=\'0.7\'/><circle cx=\'20\' cy=\'40\' r=\'0.3\' fill=\'white\' opacity=\'0.5\'/><circle cx=\'50\' cy=\'35\' r=\'0.5\' fill=\'white\' opacity=\'0.8\'/><circle cx=\'90\' cy=\'45\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/><circle cx=\'15\' cy=\'70\' r=\'0.4\' fill=\'white\' opacity=\'0.7\'/><circle cx=\'40\' cy=\'65\' r=\'0.2\' fill=\'white\' opacity=\'0.5\'/><circle cx=\'70\' cy=\'75\' r=\'0.5\' fill=\'white\' opacity=\'0.9\'/><circle cx=\'85\' cy=\'80\' r=\'0.3\' fill=\'white\' opacity=\'0.6\'/></svg>") repeat',
            backgroundSize: '200px 200px'
          }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="ml-8 flex items-center space-x-2">
                <img 
                  src="/img/logo.png" 
                  alt="Carreermate logo" 
                  className="h-16 w-auto mr-3"
                />
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-[#fff]">
                <Mail className="w-4 h-4" />
                <span>support@careermate.vn</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-[#fff]">
                <Phone className="w-4 h-4" />
                <span>1900 1234 567</span>
              </div>
              <div className="flex items-center space-x-2 mb-7  text-sm text-[#fff]">
                <MapPin className="w-4 h-4" />
                <span>HCM City, Vietnam</span>
              </div>
            </div>
            {/* Social Media */}
            <div>
              <h4 className="font-medium text-[#fff] mb-3">Connect with us</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg text-[#fff] font-semibold mt-10 mb-4">Explore more</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Assessments
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg text-[#fff] font-semibold mt-10 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg text-[#fff] font-bold mt-10 mb-4">Companies</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Recruitment
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div> 
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 pb-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-[#fff]">
              <span>&copy; 2025 CareerMate</span>
              <div>
                <Link href="/privacy&terms" className="hover:text-white transition-colors">
                  Privacy {"&"} Terms
                </Link>
              </div>
            </div>

            {/* Scroll to top button */}
            {/* <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-[#fff] hover:text-white transition-colors text-sm"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Scroll to top</span>
            </button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}