import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-4 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="relative">
        <img 
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Spring Boot Development" 
          className="rounded-lg shadow-2xl"
        />
        <div className="absolute -bottom-4 -right-4 bg-white rounded p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Spring Boot 3.0</span>
          </div>
        </div>
        <div className="absolute -top-4 -left-4 bg-white rounded p-4 shadow-lg">
          <div className="text-sm font-bold text-blue-900">Generate & Deploy</div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;