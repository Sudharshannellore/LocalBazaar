import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Local Bazaar</h3>
            <p className="text-gray-600">
              Connecting local artisans, farmers, and small businesses with consumers.
              Supporting sustainable and traditional commerce.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/about" className="hover:text-gray-950">About Us</a></li>
              <li><a href="/contact" className="hover:text-gray-950">Contact</a></li>
              <li><a href="/login/business" className="hover:text-gray-950">Become a Dealer</a></li>
              <li><a href="/faq" className="hover:text-gray-950">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-emerald-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-emerald-400">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-600">
          <p>&copy; 2025 Local Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;