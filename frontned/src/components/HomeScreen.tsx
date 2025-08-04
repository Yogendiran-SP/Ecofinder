import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Users, UserPlus } from 'lucide-react';

const HomeScreen: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with environmental theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3735743/pexels-photo-3735743.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-blue-900/60 to-emerald-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
              <Recycle className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Ecofinder
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            Transforming waste into opportunity through AI-powered recycling solutions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <Link
            to="/login"
            className="group flex-1 flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Users className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-semibold">Login</span>
          </Link>
          
          <Link
            to="/register"
            className="group flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-6 w-6 group-hover:rotate-12 transition-transform" />
            <span className="text-lg font-semibold">Register</span>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">AI Waste Detection</h3>
            <p className="text-white/80 text-sm">Identify waste types instantly with our advanced AI technology</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Find Recycling Centers</h3>
            <p className="text-white/80 text-sm">Locate nearby recycling facilities based on your waste type</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="bg-emerald-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Community Driven</h3>
            <p className="text-white/80 text-sm">Connect with local recycling businesses and eco-conscious users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;