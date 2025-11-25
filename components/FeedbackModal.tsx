import React from 'react';
import { GeminiResponse } from '../types';
import { X, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GeminiResponse | null;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#fffdf5] w-full max-w-md rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-600 relative">
        
        {/* Decorative Corner Knots */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-red-800"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-red-800"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-red-800"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-red-800"></div>

        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center text-yellow-600">
            <Sparkles size={48} className="animate-pulse" />
          </div>

          <h2 className="text-2xl font-calligraphy text-red-900 mb-2 font-bold">上上签</h2>
          
          <div className="my-6 py-4 border-y border-red-100 relative">
             <p className="text-xl font-serif text-gray-800 leading-loose whitespace-pre-wrap">
               {data.prediction}
             </p>
          </div>

          <div className="text-left bg-yellow-50 p-4 rounded-lg mb-4">
             <h4 className="text-sm font-bold text-yellow-800 mb-1">神明指引：</h4>
             <p className="text-sm text-gray-700 leading-relaxed">{data.guidance}</p>
          </div>

          <div className="flex justify-center items-center space-x-2 text-red-800 mb-6">
             <span className="font-bold">幸运数字：</span>
             <span className="text-2xl font-mono border-2 border-red-800 rounded-full w-10 h-10 flex items-center justify-center bg-white">
                {data.luckyNumber}
             </span>
          </div>

          <button 
            onClick={onClose}
            className="bg-[#8B0000] text-[#fce7ac] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            叩谢神恩
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
