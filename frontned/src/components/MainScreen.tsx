import React, { useState, useRef } from 'react';
import { Camera, Upload, RotateCcw, MapPin, Star, Phone, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WasteAnalysis, Shopkeeper } from '../types';
import Layout from './Layout';
import WasteAnalysisResult from './WasteAnalysisResult.tsx';
import RecyclingMap from './RecyclingMap';

const MainScreen: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [nearbyShops, setNearbyShops] = useState<Shopkeeper[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();

  // Mock AI analysis function
  const analyzeWaste = (_imageData: string): WasteAnalysis => {
    const wasteTypes = [
      { type: 'Plastic', harmLevel: 'High' as const, confidence: 85 },
      { type: 'Electronic', harmLevel: 'High' as const, confidence: 92 },
      { type: 'Organic', harmLevel: 'Low' as const, confidence: 78 },
      { type: 'Metal', harmLevel: 'Medium' as const, confidence: 88 },
      { type: 'Glass', harmLevel: 'Medium' as const, confidence: 95 }
    ];

    const randomWaste = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    
    return {
      ...randomWaste,
      recommendations: [
        `Find nearest ${randomWaste.type.toLowerCase()} recycling center`,
        'Separate this waste from regular trash',
        'Consider eco-friendly alternatives for future use'
      ]
    };
  };

  // Mock function to get nearby shops
  const getNearbyShops = (wasteType: string): Shopkeeper[] => {
    const allShops = JSON.parse(localStorage.getItem('ecofinder-shopkeepers') || '[]');
    return allShops.filter((shop: Shopkeeper) => 
      shop.wasteTypes.some(type => 
        type.toLowerCase().includes(wasteType.toLowerCase()) ||
        wasteType.toLowerCase().includes(type.toLowerCase())
      )
    ).slice(0, 3);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        performAnalysis(imageData);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        performAnalysis(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (imageData: string) => {
    setLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = analyzeWaste(imageData);
    setAnalysis(result);
    
    // Get nearby shops based on waste type
    const shops = getNearbyShops(result.type);
    setNearbyShops(shops);
    
    setLoading(false);
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setNearbyShops([]);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showCamera) {
    return (
      <Layout showHeader={true}>
        <div className="min-h-screen bg-black flex flex-col">
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={capturePhoto}
                className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Camera className="h-8 w-8 text-gray-800" />
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeader={true}>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!capturedImage && !analysis && (
            <div className="text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome, {user?.name}!
                </h1>
                <p className="text-xl text-gray-600">
                  Snap a photo of your waste to get AI-powered recycling recommendations
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <button
                    onClick={startCamera}
                    className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Camera className="h-16 w-16 mx-auto mb-4 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">Take Photo</h3>
                    <p className="text-green-100">Use your camera to capture waste</p>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="group bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Upload className="h-16 w-16 mx-auto mb-4 group-hover:rotate-12 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">Upload Photo</h3>
                    <p className="text-blue-100">Select image from gallery</p>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Captured Image</h2>
                  <button
                    onClick={resetAnalysis}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Retake</span>
                  </button>
                </div>
                <img
                  src={capturedImage}
                  alt="Captured waste"
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              </div>

              {loading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Image...</h3>
                  <p className="text-gray-600">Our AI is identifying the waste type and harm level</p>
                </div>
              )}

              {analysis && (
                <>
                  <WasteAnalysisResult analysis={analysis} />
                  
                  {nearbyShops.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <MapPin className="h-6 w-6 mr-2 text-green-600" />
                        Nearby Recycling Centers
                      </h3>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nearbyShops.map((shop) => (
                          <div key={shop.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                            {shop.shopPhoto && (
                              <img
                                src={shop.shopPhoto}
                                alt={shop.shopName}
                                className="w-full h-40 object-cover rounded-lg mb-4"
                              />
                            )}
                            <h4 className="text-lg font-bold text-gray-800 mb-2">{shop.shopName}</h4>
                            <p className="text-gray-600 mb-2">{shop.shopAddress}</p>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{shop.description}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{shop.rating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500">({shop.totalRatings})</span>
                              </div>
                              <div className="flex items-center space-x-2 text-green-600">
                                <Phone className="h-4 w-4" />
                                <span className="text-sm font-medium">{shop.phone}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {shop.wasteTypes.slice(0, 3).map((type) => (
                                <span key={type} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {type}
                                </span>
                              ))}
                            </div>
                            
                            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center justify-center space-x-2">
                              <ExternalLink className="h-4 w-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <RecyclingMap shops={nearbyShops} wasteType={analysis.type} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MainScreen;