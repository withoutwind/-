import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, PenLine, X } from 'lucide-react';
import { DEITIES, PRICING_TIERS, ITEM_ICONS } from './constants';
import { Deity, ItemType, Tier, OfferingState, GeminiResponse } from './types';
import DeityStage from './components/DeityStage';
import SelectionModal from './components/SelectionModal';
import DeitySelectionModal from './components/DeitySelectionModal';
import PaymentModal from './components/PaymentModal';
import FeedbackModal from './components/FeedbackModal';
import { getDivineGuidance } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [currentDeity, setCurrentDeity] = useState<Deity>(DEITIES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [wishText, setWishText] = useState('');
  // Wish input hidden by default so user sees the button
  const [showWishInput, setShowWishInput] = useState(false);
  
  const [offerings, setOfferings] = useState<OfferingState>({
    incenseTier: PRICING_TIERS[0],
    candleTier: PRICING_TIERS[0],
    tributeTier: PRICING_TIERS[0],
  });

  const [activeModalType, setActiveModalType] = useState<ItemType | null>(null);
  const [showDeityModal, setShowDeityModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState<{tier: Tier, type: ItemType} | null>(null);
  const [feedbackData, setFeedbackData] = useState<GeminiResponse | null>(null);
  
  const [isBurning, setIsBurning] = useState(false);
  const [isPraying, setIsPraying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handlers
  const handleDeityChange = (deity: Deity) => {
    setCurrentDeity(deity);
    setCustomImage(null);
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomImage(url);
  };

  const openSelection = (type: ItemType) => {
    setActiveModalType(type);
  };

  const handleItemSelect = (tier: Tier) => {
    if (!activeModalType) return;
    
    // Close selection modal
    const type = activeModalType;
    setActiveModalType(null);

    // If paid, open payment modal
    if (tier.price > 0) {
      setPaymentModalData({ tier, type });
    } else {
      confirmItemSelection(type, tier);
    }
  };

  const confirmItemSelection = (type: ItemType, tier: Tier) => {
    setOfferings(prev => {
        switch(type) {
            case ItemType.INCENSE: return { ...prev, incenseTier: tier };
            case ItemType.CANDLE: return { ...prev, candleTier: tier };
            case ItemType.TRIBUTE: return { ...prev, tributeTier: tier };
            default: return prev;
        }
    });
  };

  const handlePaymentConfirm = () => {
    if (paymentModalData) {
        confirmItemSelection(paymentModalData.type, paymentModalData.tier);
        setPaymentModalData(null);
    }
  };

  const handlePray = async () => {
    if (isPraying) return;
    
    // Auto open wish input if empty? No, just proceed with empty/default wish.
    
    setIsPraying(true);
    setIsBurning(true);
    setShowWishInput(false); // Hide wish input during prayer

    // Calculate total donation
    const total = offerings.incenseTier.price + offerings.candleTier.price + offerings.tributeTier.price;

    try {
        const result = await getDivineGuidance(currentDeity, wishText, total);
        
        // Wait for visual effect (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        setFeedbackData(result);
        setShowFeedback(true);
    } catch (e) {
        console.error("Prayer failed", e);
    } finally {
        setIsPraying(false);
    }
  };

  const handleReset = () => {
      setShowFeedback(false);
      setIsBurning(false);
      setWishText('');
      setShowWishInput(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#1a0505] text-[#fce7ac] font-serif relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/chinese-style.png')] opacity-10 pointer-events-none"></div>

      {/* Main Stage (Deity & Altar) */}
      <DeityStage 
        deity={currentDeity} 
        customImage={customImage} 
        offerings={offerings} 
        isBurning={isBurning}
      />

      {/* Wish Input Box (Floating) */}
      {!isBurning && (
        <div className={`absolute left-1/2 -translate-x-1/2 z-30 w-[80%] max-w-sm transition-all duration-300 ${showWishInput ? 'bottom-32 opacity-100 scale-100' : 'bottom-20 opacity-0 scale-95 pointer-events-none'}`}>
             <div className="relative">
                <textarea 
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="在此写下您的心愿..."
                    className="w-full bg-black/80 backdrop-blur-md border-2 border-[#8B0000] rounded-lg px-4 py-3 text-center text-[#fce7ac] placeholder-white/40 focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_15px_rgba(255,215,0,0.3)] resize-none h-24 shadow-xl"
                />
                <button 
                  onClick={() => setShowWishInput(false)}
                  className="absolute -top-3 -right-3 bg-[#8B0000] text-white rounded-full p-1 border border-[#fce7ac] shadow-lg hover:scale-110 transition-transform"
                >
                  <X size={14} />
                </button>
             </div>
        </div>
      )}

      {/* Show Wish Button (When input is hidden) */}
      {!isBurning && !showWishInput && (
        <button 
          onClick={() => setShowWishInput(true)}
          className="absolute bottom-32 left-[5%] z-30 bg-black/40 backdrop-blur border border-[#8B0000] text-[#fce7ac] px-5 py-2 rounded-full flex items-center space-x-2 animate-bounce hover:bg-black/60 shadow-[0_0_10px_rgba(252,231,172,0.3)]"
        >
          <PenLine size={16} />
          <span>填写愿望</span>
        </button>
      )}

      {/* Prayer Button (Bottom Right, Floating) */}
      {!isBurning && (
        <div className="absolute bottom-[100px] right-[5%] z-40">
           <button 
              onClick={handlePray}
              className="bg-[#8B0000] text-[#fce7ac] w-20 h-20 rounded-full border-4 border-[#fce7ac] shadow-[0_0_20px_rgba(255,215,0,0.5)] flex flex-col items-center justify-center animate-pulse hover:scale-110 active:scale-95 transition-all group relative"
          >
              <div className="absolute inset-0 rounded-full border border-yellow-500 animate-ping opacity-50"></div>
              <span className="text-3xl font-calligraphy relative z-10">祈</span>
          </button>
          <div className="text-center mt-2 text-xs font-bold text-yellow-500 bg-black/50 rounded px-2">点击祈福</div>
        </div>
      )}

      {/* Burning Status Indicator */}
      {isBurning && (
         <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
             <div className="bg-black/50 px-6 py-2 rounded-full backdrop-blur text-yellow-200 animate-pulse border border-yellow-500/30">
                祈福中...
             </div>
         </div>
      )}

      {/* Bottom Controls */}
      <div className="bg-[#2a0a0a] border-t-2 border-[#4a1010] z-30 shrink-0 pb-6 pt-3 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-end max-w-md mx-auto relative">
            
            {/* 1. Deity Selection (Left) */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => setShowDeityModal(true)}>
                <div className="w-14 h-14 bg-[#3d0e0e] rounded-full flex items-center justify-center border-2 border-[#5c1c1c] mb-1 group-hover:border-yellow-600 transition-colors overflow-hidden">
                    {customImage ? (
                       <img src={customImage} alt="User" className="w-full h-full object-cover" />
                    ) : (
                       <img src={currentDeity.imageUrl} alt={currentDeity.name} className="w-full h-full object-cover opacity-80" />
                    )}
                </div>
                <span className="text-xs text-yellow-600 font-bold">请神</span>
            </div>

            {/* 2. Incense */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => openSelection(ItemType.INCENSE)}>
                <div className="w-14 h-14 bg-[#3d0e0e] rounded-full flex items-center justify-center border border-[#5c1c1c] mb-1 relative group-hover:border-[#8B0000] transition-colors">
                    <span className="text-2xl">{ITEM_ICONS[ItemType.INCENSE]}</span>
                    {offerings.incenseTier.price > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-white border border-[#2a0a0a]">¥</span>}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-[#fce7ac]">请香</span>
            </div>

            {/* 3. Candle */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => openSelection(ItemType.CANDLE)}>
                <div className="w-14 h-14 bg-[#3d0e0e] rounded-full flex items-center justify-center border border-[#5c1c1c] mb-1 relative group-hover:border-[#8B0000] transition-colors">
                     <span className="text-2xl">{ITEM_ICONS[ItemType.CANDLE]}</span>
                     {offerings.candleTier.price > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-white border border-[#2a0a0a]">¥</span>}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-[#fce7ac]">供灯</span>
            </div>

            {/* 4. Tribute (Right) */}
            <div className="flex flex-col items-center cursor-pointer group" onClick={() => openSelection(ItemType.TRIBUTE)}>
                <div className="w-14 h-14 bg-[#3d0e0e] rounded-full flex items-center justify-center border border-[#5c1c1c] mb-1 relative group-hover:border-[#8B0000] transition-colors">
                    <span className="text-2xl">{ITEM_ICONS[ItemType.TRIBUTE]}</span>
                    {offerings.tributeTier.price > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full text-white border border-[#2a0a0a]">¥</span>}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-[#fce7ac]">供果</span>
            </div>
        </div>
      </div>

      {/* Modals */}
      <DeitySelectionModal 
        isOpen={showDeityModal}
        currentDeity={currentDeity}
        onClose={() => setShowDeityModal(false)}
        onSelect={handleDeityChange}
        onUpload={handleImageUpload}
      />

      <SelectionModal 
        isOpen={!!activeModalType} 
        type={activeModalType!} 
        onClose={() => setActiveModalType(null)} 
        onSelect={handleItemSelect}
      />
      
      {paymentModalData && (
          <PaymentModal
            isOpen={!!paymentModalData}
            tier={paymentModalData.tier}
            itemType={paymentModalData.type}
            onClose={() => setPaymentModalData(null)}
            onConfirm={handlePaymentConfirm}
          />
      )}

      <FeedbackModal 
        isOpen={showFeedback}
        onClose={handleReset}
        data={feedbackData}
      />

    </div>
  );
};

export default App;