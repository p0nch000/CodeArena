import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 relative">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-end items-center">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="logoMTH.png" // ← Cambia esta URL por la de tu logo
              alt="Company Logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 items-center">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <FaLinkedin size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
               className="text-gray-400 hover:text-white transition-colors">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}