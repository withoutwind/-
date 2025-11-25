import React, { useRef } from 'react';
import { Deity } from '../types';
import { DEITIES } from '../constants';
import { X, Upload, Check } from 'lucide-react';

interface DeitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDeity: Deity;
  onSelect: (deity: Deity) => void;
  onUpload: (file: File) => void;
}

const DeitySelectionModal: React.FC<DeitySelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  currentDeity, 
  onSelect,
  onUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#fff1cf] w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-4 border-[#8B0000]">
        
        {/* Header */}
        <div className="bg-[#8B0000] p-4 flex justify-between items-center text-[#fce7ac]">
          <h3 className="text-xl font-calligraphy font-bold tracking-widest">请神</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {DEITIES.map((deity) => (
            <button
              key={deity.id}
              onClick={() => {
                onSelect(deity);
                onClose();
              }}
              className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                currentDeity.id === deity.id 
                  ? 'bg-red-50 border-red-600 shadow-md' 
                  : 'bg-white border-[#d4b483] hover:border-red-400'
              }`}
            >
              <div className="w-full aspect-[3/4] rounded overflow-hidden mb-2 bg-gray-100">
                <img 
                  src={deity.imageUrl} 
                  alt={deity.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`font-bold font-serif ${currentDeity.id === deity.id ? 'text-red-800' : 'text-gray-800'}`}>
                {deity.name}
              </span>
              
              {currentDeity.id === deity.id && (
                <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-0.5">
                  <Check size={12} />
                </div>
              )}
            </button>
          ))}

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-dashed border-[#8B0000]/50 bg-[#8B0000]/5 hover:bg-[#8B0000]/10 transition-colors aspect-[3/4]"
          >
            <div className="w-12 h-12 rounded-full bg-[#8B0000]/10 flex items-center justify-center mb-2">
              <Upload size={24} className="text-[#8B0000]" />
            </div>
            <span className="font-bold text-[#8B0000] text-sm">上传照片</span>
            <span className="text-xs text-[#8B0000]/60 mt-1">支持GIF/JPG</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeitySelectionModal;