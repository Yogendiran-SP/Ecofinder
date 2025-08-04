import React from 'react';
import { WasteAnalysis } from '../types';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface WasteAnalysisResultProps {
  analysis: WasteAnalysis;
}

const getColors = (harmLevel: string) => {
  switch (harmLevel.toLowerCase()) {
    case 'high':
      return {
        cardBg: 'bg-red-50 border-red-200',
        badge: 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white',
        alert: 'text-pink-500',
        bulb: 'text-pink-500',
      };
    case 'medium':
      return {
        cardBg: 'bg-yellow-50 border-yellow-200',
        badge: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        alert: 'text-yellow-500',
        bulb: 'text-yellow-500',
      };
    case 'low':
      return {
        cardBg: 'bg-green-50 border-green-200',
        badge: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
        alert: 'text-green-500',
        bulb: 'text-green-500',
      };
    default:
      return {
        cardBg: 'bg-gray-50 border-gray-200',
        badge: 'bg-gray-300 text-gray-800',
        alert: 'text-gray-400',
        bulb: 'text-gray-400',
      };
  }
};

const WasteAnalysisResult: React.FC<WasteAnalysisResultProps> = ({ analysis }) => {
  const colors = getColors(analysis.harmLevel);

  return (
    <div className={`${colors.cardBg} border rounded-2xl shadow-lg p-8 mb-8`}>
      <div className="flex flex-col items-center mb-4">
        <AlertTriangle className={`h-8 w-8 mb-2 ${colors.alert}`} />
        <h2 className="text-2xl font-bold mb-2">Analysis Complete</h2>
        <div className={`px-4 py-2 rounded-full font-semibold text-lg mb-2 ${colors.badge}`}>
          This waste is {analysis.type} and is {analysis.harmLevel} harmful
        </div>
        <div className="text-gray-700 mb-2">Confidence: {analysis.confidence}%</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow flex flex-col items-start">
        <div className="flex items-center mb-2">
          <Lightbulb className={`h-5 w-5 mr-2 ${colors.bulb}`} />
          <span className="font-semibold text-lg">Recommendations</span>
        </div>
        <ul className="list-disc pl-6 space-y-1">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="text-black">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WasteAnalysisResult;