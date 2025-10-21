import React, { useState, useMemo, useEffect } from 'react';
import type { Service, OrderDetails, User, Platform, View } from '../types';

interface OrderFormProps {
  onStartPayment: (details: OrderDetails) => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  platforms: Record<string, Platform>;
  setView: (view: View) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onStartPayment, isAuthenticated, currentUser, platforms, setView }) => {
  const platformKeys = Object.keys(platforms);
  const [platform, setPlatform] = useState<string>(platformKeys.length > 0 ? platformKeys[0] : '');
  const [service, setService] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // FIX: This effect ensures a default platform is selected once the platforms data is loaded,
  // preventing the component from getting stuck in a loading state.
  useEffect(() => {
    const platformKeys = Object.keys(platforms);
    if (platformKeys.length > 0 && !platforms[platform]) {
        setPlatform(platformKeys[0]);
    }
  }, [platforms]);

  useEffect(() => {
    if (platform && platforms[platform]) {
        const serviceKeys = Object.keys(platforms[platform].services);
        if (serviceKeys.length > 0) {
            const firstServiceKey = serviceKeys[0];
            setService(firstServiceKey);
            setQuantity(platforms[platform].services[firstServiceKey].min);
        } else {
             setService('');
        }
    }
  }, [platform, platforms]);
  
  const currentPlatform = platforms[platform];
  const currentService: Service | undefined = currentPlatform?.services[service];

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    // The useEffect will handle updating the service and quantity
  };
  
  const handleServiceClick = (newServiceKey: string) => {
    setService(newServiceKey);
    const newService = currentPlatform.services[newServiceKey];
    if (newService) {
      setQuantity(newService.min);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = currentService?.min || 0;
    setQuantity(value);
  };
  
  const price = useMemo(() => {
    if (!currentService) return 0;
    return (quantity / 1000) * currentService.pricePer1000;
  }, [quantity, currentService]);

  const handleBuyNow = () => {
    // For unauthenticated users, the button's purpose is to trigger the login flow.
    // The details don't matter much yet since they aren't persisted through login.
    if (!isAuthenticated) {
        onStartPayment({
            platform: currentPlatform.name,
            service: currentService?.name || '',
            quantity,
            cost: price,
            link,
            paymentMethod: 'none' // Placeholder, will be decided after login
        });
        return;
    }

    // Validation for authenticated users
    if(!link || !currentService) {
        alert("الرجاء إدخال رابط صالح وتحديد خدمة.");
        return;
    }
    if(quantity < currentService.min || quantity > currentService.max){
        alert(`الكمية يجب أن تكون بين ${currentService.min} و ${currentService.max}`);
        return;
    }
    if (!paymentMethod) {
        alert("الرجاء اختيار طريقة الدفع.");
        return;
    }
    if (paymentMethod === 'balance' && currentUser && price > currentUser.balance) {
        // The button is disabled, but this is a safeguard.
        alert("رصيدك غير كافٍ لإتمام هذه العملية.");
        return;
    }
    
    if (currentService) {
        onStartPayment({
            platform: currentPlatform.name,
            service: currentService.name,
            quantity: quantity,
            cost: price,
            link: link,
            paymentMethod: paymentMethod!,
        });
    }
  }
  
  if (!currentPlatform) {
    return <div>...Loading</div> // Or some other placeholder
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">ابدأ حملتك الآن</h2>
            <p className="mt-4 text-lg text-gray-400">اختر الخدمة التي تناسبك واحصل على نتائج فورية.</p>
            <div className="mt-4 w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto bg-brand-card rounded-2xl shadow-2xl shadow-brand-primary/10 overflow-hidden">
            <div className="p-8">
                {/* Platform Selection */}
                <div className="mb-6">
                    <label className="block text-lg font-bold mb-3 text-gray-300">اختر المنصة</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(platforms).map((p) => (
                            <button key={p.id} onClick={() => handlePlatformChange(p.id)} className={`p-4 rounded-lg transition-all duration-300 text-center font-semibold border-2 ${platform === p.id ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}>
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                 {/* Service Selection */}
                <div className="mb-6">
                    <label className="block text-lg font-bold mb-3 text-gray-300">نوع الخدمة</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(currentPlatform.services).map(([key, s]) => (
                            <button
                                key={key}
                                onClick={() => handleServiceClick(key)}
                                className={`p-4 rounded-lg transition-all duration-300 text-center font-semibold border-2 ${service === key ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Link Input */}
                <div className="mb-6">
                    <label htmlFor="link" className="block text-lg font-bold mb-2 text-gray-300">رابط الصفحة أو المنشور</label>
                    <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder={currentPlatform.placeholder} className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" />
                </div>

                {/* Quantity and Price */}
                <div className="mt-6">
                    <label htmlFor="quantity" className="block text-lg font-bold mb-2 text-gray-300">الكمية</label>
                    <input type="range" id="quantity" min={currentService?.min} max={currentService?.max} value={quantity} onChange={handleQuantityChange} step="100" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                    <div className="flex justify-between items-center mt-2 text-gray-400">
                        <span>{currentService?.min}</span>
                        <input type="number" value={quantity} onChange={handleQuantityChange} className="w-24 p-2 text-center bg-gray-800 border border-gray-600 rounded-md text-white font-bold" />
                        <span>{currentService?.max}</span>
                    </div>
                </div>
                
                {/* Order Summary */}
                <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                    <p className="text-xl text-gray-400 mb-2">التكلفة الإجمالية:</p>
                    <p className="text-4xl font-black text-brand-primary tracking-wider">${price.toFixed(2)}</p>
                    
                     {isAuthenticated && currentUser ? (
                        <>
                            {/* Payment Options for logged-in users */}
                            <div className="mt-6">
                                <label className="block text-lg font-bold mb-4 text-gray-300">اختر طريقة الدفع</label>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button
                                        key="balance"
                                        onClick={() => setPaymentMethod('balance')}
                                        className={`flex-1 p-3 rounded-lg transition-all duration-300 text-center font-semibold border-2 ${paymentMethod === 'balance' ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                                    >
                                        الدفع بالرصيد (${currentUser.balance.toFixed(2)})
                                    </button>
                                    <button
                                        key="add_funds"
                                        onClick={() => setView('addFunds')}
                                        className="flex-1 p-3 rounded-lg transition-all duration-300 text-center font-semibold border-2 bg-green-700 border-green-600 hover:border-green-500 text-white"
                                    >
                                        شحن الرصيد
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleBuyNow} 
                                disabled={paymentMethod === 'balance' && price > currentUser.balance}
                                className="mt-8 w-full bg-brand-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 text-xl disabled:bg-red-800 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {paymentMethod === 'balance' && price > currentUser.balance ? 'رصيد غير كاف' : 'شراء الآن'}
                            </button>
                        </>
                    ) : (
                         <button 
                            onClick={handleBuyNow} 
                            className="mt-8 w-full bg-brand-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 text-xl"
                        >
                            سجل الدخول للشراء
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default OrderForm;