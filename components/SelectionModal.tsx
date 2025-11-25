import React from 'react';
import { ItemType, Tier } from '../types';
import { PRICING_TIERS } from '../constants';
import { X, Check } from 'lucide-react';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ItemType;
  onSelect: (tier: Tier) => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, type, onSelect }) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch(type) {
      case ItemType.INCENSE: return "请香";
      case ItemType.CANDLE: return "供灯";
      case ItemType.TRIBUTE: return "供果";
      default: return "选择";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#fff1cf] w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-4 border-[#8B0000]">
        
        {/* Header */}
        <div className="bg-[#8B0000] p-4 flex justify-between items-center text-[#fce7ac]">
          <h3 className="text-xl font-calligraphy font-bold tracking-widest">{getTitle()}</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {PRICING_TIERS.map((tier) => (
            <div 
              key={tier.price}
              onClick={() => onSelect(tier)}
              className={`
                relative flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${tier.price === 0 ? 'bg-white border-gray-300' : 'bg-red-50 border-red-200'}
                hover:border-red-600 hover:shadow-md active:scale-95
              `}
            >
              <div className="flex-1">
                 <div className="flex items-center space-x-2">
                    <span className={`font-bold text-lg ${tier.price > 0 ? 'text-red-800' : 'text-gray-700'}`}>
                        {tier.label}
                    </span>
                    {tier.effectLevel > 4 && <span className="text-xs bg-yellow-500 text-white px-1 rounded">特效</span>}
                 </div>
                 <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
              </div>
              
              {/* Visual Indicator of price */}
              <div className="text-right">
                  {tier.price > 0 ? (
                      <span className="text-red-600 font-bold">¥{tier.price}</span>
                  ) : (
                      <span className="text-green-600 font-bold">免费</span>
                  )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-yellow-100 text-center text-xs text-gray-600 border-t border-yellow-200">
           随喜功德，量力而行
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
