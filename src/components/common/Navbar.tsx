import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Terminal size={28} className={`${isScrolled ? 'text-blue-900' : 'text-white'}`} />
            <span className={`text-xl font-bold ${isScrolled ? 'text-blue-900' : 'text-white'}`}>SpringGen</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className={`md:hidden ${isScrolled ? 'text-blue-900' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-white hover:text-blue-100'}`}>
              Home
            </Link>
            <Link to="/generate" className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-white hover:text-blue-100'}`}>
              Generate
            </Link>
            <a 
              href="https://spring.io/projects/spring-boot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`font-medium ${isScrolled ? 'text-gray-700 hover:text-blue-900' : 'text-white hover:text-blue-100'}`}
            >
              Docs
            </a>
            <Link 
              to="/generate" 
              className={`btn ${isScrolled ? 'btn-primary' : 'btn-secondary'}`}
            >
              Get Started
            </Link>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/generate" 
                className="font-medium text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Generate
              </Link>
              <a 
                href="https://spring.io/projects/spring-boot" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-gray-800"
              >
                Docs
              </a>
              <Link 
                to="/generate" 
                className="btn btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;