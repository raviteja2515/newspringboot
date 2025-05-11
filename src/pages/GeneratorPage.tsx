import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Database, Code, Download } from 'lucide-react';

interface Step {
  title: string;
  icon: React.ReactNode;
}

interface DatabaseConfig {
  name: string;
  logo: string;
  description: string;
  configFields: {
    url: string;
    username?: string;
    password?: string;
    driver?: string;
  };
}

const databases: DatabaseConfig[] = [
  {
    name: 'PostgreSQL',
    logo: 'https://www.postgresql.org/media/img/about/press/elephant.png',
    description: 'Robust, open source relational database',
    configFields: {
      url: 'jdbc:postgresql://localhost:5432/dbname',
      username: 'postgres',
      password: 'password',
      driver: 'org.postgresql.Driver'
    }
  },
  {
    name: 'MySQL',
    logo: 'https://labs.mysql.com/common/logos/mysql-logo.svg',
    description: 'Popular open source relational database',
    configFields: {
      url: 'jdbc:mysql://localhost:3306/dbname',
      username: 'root',
      password: 'password',
      driver: 'com.mysql.cj.jdbc.Driver'
    }
  },
  {
    name: 'MongoDB',
    logo: 'https://www.mongodb.com/assets/images/global/leaf.png',
    description: 'NoSQL document oriented database',
    configFields: {
      url: 'mongodb://localhost:27017/dbname'
    }
  },
  {
    name: 'H2',
    logo: 'https://www.h2database.com/html/images/h2-logo-2.png',
    description: 'Lightweight in-memory database',
    configFields: {
      url: 'jdbc:h2:mem:testdb',
      username: 'sa',
      password: '',
      driver: 'org.h2.Driver'
    }
  }
];

const steps: Step[] = [
  { title: 'Project Setup', icon: <Package size={24} /> },
  { title: 'Database Config', icon: <Database size={24} /> },
  { title: 'Schema Design', icon: <Code size={24} /> },
  { title: 'Generate & Download', icon: <Download size={24} /> },
];

const GeneratorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    groupId: 'com.example',
    artifactId: 'demo',
    projectName: '',
    description: '',
    javaVersion: 'Java 21',
    springBootVersion: '3.1.5',
    packageType: 'JAR',
    dependencies: new Set(['Spring Web']),
    selectedDatabase: null as DatabaseConfig | null,
    databaseConfig: {
      url: '',
      username: '',
      password: '',
      driver: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDatabaseSelect = (database: DatabaseConfig) => {
    setFormData(prev => ({
      ...prev,
      selectedDatabase: database,
      databaseConfig: database.configFields,
      dependencies: new Set([...prev.dependencies, `${database.name} Driver`])
    }));
  };

  const handleDatabaseConfigChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      databaseConfig: {
        ...prev.databaseConfig,
        [field]: value
      }
    }));
  };

  const handleDependencyToggle = (dependency: string) => {
    setFormData(prev => {
      const newDeps = new Set(prev.dependencies);
      if (newDeps.has(dependency)) {
        newDeps.delete(dependency);
      } else {
        newDeps.add(dependency);
      }
      return { ...prev, dependencies: newDeps };
    });
  };

  const generateProject = async () => {
    const projectData = {
      ...formData,
      dependencies: Array.from(formData.dependencies)
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate project');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.artifactId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Failed to generate project. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Project Setup</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group ID
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.groupId}
                  onChange={(e) => handleInputChange('groupId', e.target.value)}
                  placeholder="com.example"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artifact ID
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.artifactId}
                  onChange={(e) => handleInputChange('artifactId', e.target.value)}
                  placeholder="demo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Java Version
                </label>
                <select 
                  className="input"
                  value={formData.javaVersion}
                  onChange={(e) => handleInputChange('javaVersion', e.target.value)}
                >
                  <option>Java 21</option>
                  <option>Java 17</option>
                  <option>Java 11</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spring Boot Version
                </label>
                <select 
                  className="input"
                  value={formData.springBootVersion}
                  onChange={(e) => handleInputChange('springBootVersion', e.target.value)}
                >
                  <option>3.1.5</option>
                  <option>3.0.12</option>
                  <option>2.7.18</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Spring Boot Application"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Project description..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="packageType"
                      value="JAR"
                      checked={formData.packageType === 'JAR'}
                      onChange={(e) => handleInputChange('packageType', e.target.value)}
                      className="mr-2"
                    />
                    JAR
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="packageType"
                      value="WAR"
                      checked={formData.packageType === 'WAR'}
                      onChange={(e) => handleInputChange('packageType', e.target.value)}
                      className="mr-2"
                    />
                    WAR
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Database Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {databases.map((db) => (
                <button
                  key={db.name}
                  onClick={() => handleDatabaseSelect(db)}
                  className={`p-6 border rounded-lg transition-all ${
                    formData.selectedDatabase?.name === db.name
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="h-12 mb-4 flex items-center justify-center">
                    <img src={db.logo} alt={db.name} className="h-full object-contain" />
                  </div>
                  <h4 className="font-medium text-lg mb-2">{db.name}</h4>
                  <p className="text-sm text-gray-600">{db.description}</p>
                </button>
              ))}
            </div>
            
            {formData.selectedDatabase && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 border rounded-lg"
              >
                <h4 className="font-medium text-lg mb-4">Database Connection Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Database URL
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={formData.databaseConfig.url}
                      onChange={(e) => handleDatabaseConfigChange('url', e.target.value)}
                    />
                  </div>
                  {formData.selectedDatabase.configFields.username && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={formData.databaseConfig.username}
                        onChange={(e) => handleDatabaseConfigChange('username', e.target.value)}
                      />
                    </div>
                  )}
                  {formData.selectedDatabase.configFields.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="input"
                        value={formData.databaseConfig.password}
                        onChange={(e) => handleDatabaseConfigChange('password', e.target.value)}
                      />
                    </div>
                  )}
                  {formData.selectedDatabase.configFields.driver && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver Class
                      </label>
                      <input
                        type="text"
                        className="input"
                        value={formData.databaseConfig.driver}
                        onChange={(e) => handleDatabaseConfigChange('driver', e.target.value)}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Schema Design</h3>
            <div className="border-2 border-dashed rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Code size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">Design your data model here</p>
                <p className="text-sm text-gray-400">Drag and drop to create entities and relationships</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Project Dependencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Spring Web',
                'Spring Data JPA',
                'Spring Security',
                'Lombok',
                'Spring Boot DevTools',
                'Spring Boot Actuator',
                'Validation',
                'Spring Boot Test',
              ].map((dep) => (
                <label
                  key={dep}
                  className={`flex items-center p-4 border rounded-lg transition-colors cursor-pointer ${
                    formData.dependencies.has(dep)
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.dependencies.has(dep)}
                    onChange={() => handleDependencyToggle(dep)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">{dep}</span>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center gradient-heading mb-4">
            Spring Boot Application Generator
          </h2>
          <p className="text-center text-gray-600">
            Generate production-ready Spring Boot applications in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-900' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div
              className="progress-bar"
              style={{
                '--progress': `${(currentStep / (steps.length - 1)) * 100}%`,
              } as React.CSSProperties}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="btn btn-outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              currentStep === steps.length - 1
                ? generateProject()
                : setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
            }
          >
            {currentStep === steps.length - 1 ? 'Generate Project' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;

export default GeneratorPage