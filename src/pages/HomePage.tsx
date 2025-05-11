import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Code, Database, Layers, Rocket } from 'lucide-react';
import HeroImage from '../components/home/HeroImage';
import FeatureCard from '../components/home/FeatureCard';

const HomePage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Code size={36} className="text-blue-900" />,
      title: "Spring Boot Ready",
      description: "Create production-ready Spring Boot applications with best practices built in"
    },
    {
      icon: <Database size={36} className="text-blue-900" />,
      title: "Database Integration",
      description: "Choose from multiple databases and configure them with just a few clicks"
    },
    {
      icon: <Layers size={36} className="text-blue-900" />,
      title: "Data Model Builder",
      description: "Design your data model visually with an intuitive drag-and-drop interface"
    },
    {
      icon: <Rocket size={36} className="text-blue-900" />,
      title: "Quick Deployment",
      description: "Generate and download your project ready for deployment on any platform"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 text-white mb-10 lg:mb-0 staggered-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Spring Boot
              <br />
              <span className="text-blue-300">Prototype Generator</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Build, configure, and deploy your Spring Boot applications faster than ever before.
            </p>
            <Link to="/generate" className="btn btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-xl">
              Start Building Now
            </Link>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-heading">
            Powerful Features for Rapid Development
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-heading">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-900 text-white rounded-full text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Configure Your Project</h3>
              <p className="text-gray-600">Start by setting up your project name, package, and basic configuration.</p>
            </div>
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-900 text-white rounded-full text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Database</h3>
              <p className="text-gray-600">Select the database technology that best fits your project requirements.</p>
            </div>
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-900 text-white rounded-full text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Design Data Model</h3>
              <p className="text-gray-600">Create your entities, relationships, and fields with our visual designer.</p>
            </div>
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-blue-900 text-white rounded-full text-2xl font-bold mb-4">4</div>
              <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
              <p className="text-gray-600">Get your production-ready code in seconds and start developing right away.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/generate" className="btn btn-primary text-lg px-8 py-3">
              Start Your Project
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Spring Boot App?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Stop writing boilerplate code. Start focusing on what matters most - your business logic.
          </p>
          <Link to="/generate" className="btn btn-secondary text-lg px-8 py-3 shadow-lg hover:shadow-xl">
            Generate Your Project Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;