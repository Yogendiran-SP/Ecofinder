import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Phone, MapPin, Lock, Camera, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

interface ShopkeeperRegistrationProps {
  onBack: () => void;
}

const ShopkeeperRegistration: React.FC<ShopkeeperRegistrationProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    shopAddress: '',
    phone: '',
    password: '',
    shopPhoto: '',
    description: '',
    wasteTypes: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const wasteTypeOptions = [
    'Plastic Recycling',
    'Electronic Waste',
    'Organic Waste',
    'Paper & Cardboard',
    'Metal Scrap',
    'Glass Recycling',
    'Textile Waste',
    'Battery Disposal'
  ];

  const handleWasteTypeChange = (wasteType: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(wasteType)
        ? prev.wasteTypes.filter(type => type !== wasteType)
        : [...prev.wasteTypes, wasteType]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData, 'shopkeeper');
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-4">Your shop is now part of Ecofinder</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center mb-8">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Shopkeeper Registration</h2>
              <p className="text-gray-600">Register your recycling business with us</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter shop name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    required
                    value={formData.shopAddress}
                    onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    rows={2}
                    placeholder="Enter complete shop address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Photo URL (Optional)
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.shopPhoto}
                    onChange={(e) => setFormData({ ...formData, shopPhoto: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter shop photo URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Types You Handle
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {wasteTypeOptions.map((wasteType) => (
                    <label key={wasteType} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.wasteTypes.includes(wasteType)}
                        onChange={() => handleWasteTypeChange(wasteType)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{wasteType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Your Shop
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    rows={4}
                    placeholder="Describe your shop, services, and specialties..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Shop Profile...' : 'Register Shop'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopkeeperRegistration;