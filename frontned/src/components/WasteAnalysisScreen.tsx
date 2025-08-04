import React, { useState } from 'react';
import axios from 'axios';
import { WasteAnalysis } from '../types';
import WasteAnalysisResult from './WasteAnalysisResult';

const WasteAnalysisScreen: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const harmLevels: Record<string, 'Low' | 'Medium' | 'High'> = {
    plastic: 'High',
    metal: 'Medium',
    glass: 'Medium',
    paper: 'Low',
    cardboard: 'Low',
    trash: 'High',
  };

  const recommendationsMap: Record<string, string[]> = {
    plastic: ["Recycle at designated bins", "Avoid single-use plastics"],
    glass: ["Recycle separately", "Avoid breakage"],
    metal: ["Can be recycled", "Ensure it's clean before recycling"],
    paper: ["Can be composted or recycled", "Avoid contamination with food"],
    cardboard: ["Can be recycled", "Ensure it's clean before recycling"],
    trash: ["Dispose of properly", "Avoid littering"],
  };

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const predictions = response.data.predictions;

      if (predictions.length > 0 && predictions[0].prediction) {
        const predictedType = predictions[0].prediction.toLowerCase();

        setAnalysis({
          type: predictedType.charAt(0).toUpperCase() + predictedType.slice(1),
          harmLevel: harmLevels[predictedType] || 'Low',
          confidence: 95,
          recommendations: recommendationsMap[predictedType] || [],
        });
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {!analysis ? (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2"
          />
          <button
            onClick={handlePredict}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!file || loading}
          >
            {loading ? "Analyzing..." : "Analyze Waste"}
          </button>
        </div>
      ) : (
        <WasteAnalysisResult analysis={analysis} />
      )}
    </div>
  );
};

export default WasteAnalysisScreen;
