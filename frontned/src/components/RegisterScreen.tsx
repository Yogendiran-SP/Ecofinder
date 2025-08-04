import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Store, ArrowLeft } from 'lucide-react';
import UserRegistration from './UserRegistration';
import ShopkeeperRegistration from './ShopkeeperRegistration';
import Layout from './Layout';

const RegisterScreen: React.FC = () => {
  const [registrationType, setRegistrationType] = useState<'user' | 'shopkeeper' | null>(null);

  if (registrationType === 'user') {
    return <UserRegistration onBack={() => setRegistrationType(null)} />;
  }

  if (registrationType === 'shopkeeper') {
    return <ShopkeeperRegistration onBack={() => setRegistrationType(null)} />;
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Ecofinder</h2>
            <p className="text-xl text-gray-600">Choose your registration type to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Registration */}
            <div 
              onClick={() => setRegistrationType('user')}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">I'm a User</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Register as an individual user to identify waste types, find recycling centers, and contribute to environmental sustainability.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• AI-powered waste identification</li>
                  <li>• Find nearby recycling centers</li>
                  <li>• Track your eco-impact</li>
                  <li>• Rate recycling facilities</li>
                </ul>
                <div className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold group-hover:from-blue-600 group-hover:to-cyan-700 transition-colors">
                  Register as User
                </div>
              </div>
            </div>

            {/* Shopkeeper Registration */}
            <div 
              onClick={() => setRegistrationType('shopkeeper')}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Store className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">I'm a Shopkeeper</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Register your recycling business to connect with customers, showcase your services, and grow your eco-friendly enterprise.
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>• List your recycling services</li>
                  <li>• Connect with local customers</li>
                  <li>• Receive customer ratings</li>
                  <li>• Manage business profile</li>
                </ul>
                <div className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold group-hover:from-green-600 group-hover:to-emerald-700 transition-colors">
                  Register as Shopkeeper
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in here
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterScreen;