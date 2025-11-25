import React, { useState, useEffect } from 'react';
import { Tier, ItemType } from '../types';
import { X, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier;
  itemType: ItemType;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tier, itemType, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) setIsProcessing(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate network delay for payment
    setTimeout(() => {
      onConfirm();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-xs rounded-lg overflow-hidden text-center">
        
        <div className="bg-[#2ecc71] p-3 flex justify-between items-center text-white">
          <span className="font-bold">微信支付</span>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6">
            <p className="text-gray-500 text-sm mb-1">支付金额</p>
            <p className="text-4xl font-bold text-black mb-6">¥{tier.price.toFixed(2)}</p>

            <div className="mb-6 flex justify-center">
                {/* Simulated QR Code */}
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 p-2 relative">
                     <img 
                        src={`https://github.com/withoutwind/D09302/blob/master/ezgif-68779a38a9656fcc.png?raw=true`}
                        alt="Payment QR"
                        className="w-full h-full object-contain opacity-80"
                     />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-1 rounded">
                            <div className="w-8 h-8 bg-[#2ecc71] rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">Pay</span>
                            </div>
                        </div>
                     </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">扫一扫上面的二维码图案，进行支付</p>

            <button 
                onClick={handlePay}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center ${isProcessing ? 'bg-gray-400' : 'bg-[#2ecc71] hover:bg-[#27ae60]'}`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        处理中...
                    </>
                ) : (
                    `我已支付 ¥${tier.price}`
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
