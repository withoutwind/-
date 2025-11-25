import React from 'react';
import { Deity, OfferingState } from '../types';

interface DeityStageProps {
  deity: Deity;
  customImage: string | null;
  offerings: OfferingState;
  isBurning: boolean;
}

const DeityStage: React.FC<DeityStageProps> = ({ deity, customImage, offerings, isBurning }) => {
  const { incenseTier, candleTier, tributeTier } = offerings;

  // Render logic for effects based on tier level
  const renderSmoke = () => {
    // Base particle count on tier, boost significantly if isBurning (praying)
    const baseCount = Math.max(1, incenseTier.effectLevel); 
    const particleCount = isBurning ? baseCount * 4 : baseCount; 
    
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const delay = Math.random() * 3;
        const duration = 2 + Math.random();
        // Random horizontal drift
        const xOffset = (Math.random() - 0.5) * 20; 
        
        particles.push(
            <div 
                key={i}
                className="smoke-particle absolute bg-gray-400 opacity-0 rounded-full blur-sm"
                style={{
                    width: isBurning ? '12px' : '8px',
                    height: isBurning ? '12px' : '8px',
                    bottom: '100%',
                    left: `calc(50% + ${xOffset}px)`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`
                }}
            />
        );
    }
    return <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 pointer-events-none">{particles}</div>;
  };

  const renderCandleFlame = (side: 'left' | 'right') => {
      // Scale flame based on tier
      const scale = 0.8 + (candleTier.effectLevel * 0.2);
      const color = candleTier.effectLevel > 4 ? 'bg-yellow-100 shadow-[0_0_20px_rgba(255,215,0,0.8)]' : 'bg-orange-300';

      return (
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 ${color} rounded-t-full rounded-b-lg flame`} style={{ transform: `scale(${scale})` }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-blue-500 opacity-50 blur-[1px]"></div>
        </div>
      );
  };

  const renderTributes = () => {
    // Just simple visual representation of tributes increasing with tier
    const items = [];
    const count = tributeTier.effectLevel;
    
    // Fruit
    if (count >= 1) items.push(<span key="1" className="text-2xl drop-shadow-lg">🍎</span>);
    // Buns
    if (count >= 3) items.push(<span key="2" className="text-2xl drop-shadow-lg">🥯</span>);
    // Alcohol
    if (count >= 4) items.push(<span key="3" className="text-2xl drop-shadow-lg">🍶</span>);
    // Gold
    if (count >= 5) items.push(<span key="4" className="text-2xl drop-shadow-lg">💰</span>);
    // Gem
    if (count >= 6) items.push(<span key="5" className="text-2xl drop-shadow-lg">💎</span>);

    return (
        <div className="flex justify-center space-x-2 mt-2">
            {items}
        </div>
    );
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-end pb-4 overflow-hidden">
      {/* Halo for high tiers */}
      {(offerings.incenseTier.effectLevel > 4 || offerings.candleTier.effectLevel > 4) && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
      )}

      {/* Deity Image */}
      <div className={`relative z-10 transition-transform duration-1000 ${isBurning ? 'scale-105' : 'scale-100'}`}>
        <img 
            src={customImage || deity.imageUrl} 
            alt={deity.name} 
            className="max-h-[50vh] object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
        />
      </div>

      {/* Altar Table */}
      <div className="w-full max-w-md bg-[#2a0a0a] border-t-4 border-[#8B0000] p-4 relative z-20 mt-[-20px] shadow-2xl">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none"></div>

        <div className="flex justify-between items-end px-4">
            {/* Left Candle */}
            <div className="flex flex-col items-center relative">
                <div className="relative w-4 h-16 bg-red-700 rounded-sm border border-red-900">
                    {renderCandleFlame('left')}
                </div>
                <div className="w-8 h-2 bg-yellow-900 mt-1 rounded"></div>
            </div>

            {/* Incense Burner (Central) */}
            <div className="flex flex-col items-center flex-1 mx-4">
                 {/* Incense Sticks */}
                 <div className="relative w-16 h-24 flex justify-center items-end space-x-1 mb-1">
                    {/* 3 Sticks */}
                    <div className="w-1 h-full bg-yellow-700 relative flex justify-center">
                        <div className="absolute -top-0.5 w-1.5 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ff4500]"></div>
                        {renderSmoke()}
                    </div>
                    <div className="w-1 h-[90%] bg-yellow-700 relative flex justify-center">
                         <div className="absolute -top-0.5 w-1.5 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ff4500]"></div>
                         {renderSmoke()}
                    </div>
                    <div className="w-1 h-[95%] bg-yellow-700 relative flex justify-center">
                         <div className="absolute -top-0.5 w-1.5 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ff4500]"></div>
                         {renderSmoke()}
                    </div>
                 </div>
                 {/* Burner Pot */}
                 <div className="w-20 h-12 bg-yellow-600 rounded-b-2xl rounded-t-sm shadow-inner flex items-center justify-center border-b-4 border-yellow-800">
                    <span className="text-yellow-900 font-bold text-xs">福</span>
                 </div>
            </div>

            {/* Right Candle */}
            <div className="flex flex-col items-center relative">
                <div className="relative w-4 h-16 bg-red-700 rounded-sm border border-red-900">
                    {renderCandleFlame('right')}
                </div>
                <div className="w-8 h-2 bg-yellow-900 mt-1 rounded"></div>
            </div>
        </div>

        {/* Tributes Section */}
        <div className="border-t border-[#4a1010] mt-2 pt-2 min-h-[40px] flex items-center justify-center">
            {renderTributes()}
        </div>
      </div>
    </div>
  );
};

export default DeityStage;