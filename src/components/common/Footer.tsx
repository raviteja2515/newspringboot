import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2024 SpringGen. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-900 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://spring.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-900 transition-colors"
            >
              Spring Boot Docs
            </a>
            <a
              href="https://railway.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-900 transition-colors"
            >
              Deploy on Railway
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;