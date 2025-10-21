import React, { useState } from 'react';

interface AddFundsProps {
  onStartPayment: (amount: number, paymentMethod: string) => void;
}

const AddFunds: React.FC<AddFundsProps> = ({ onStartPayment }) => {
  const [amount, setAmount] = useState<number>(25);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const predefinedAmounts = [10, 25, 50, 100];
  const paymentOptions = [
    { id: 'bank_transfer', name: 'تحويل بنكي' },
  ];

  const handleAddFunds = () => {
    if (amount <= 0) {
      alert('الرجاء إدخال مبلغ صالح.');
      return;
    }
    if (!paymentMethod) {
      alert('الرجاء اختيار طريقة الدفع.');
      return;
    }
    onStartPayment(amount, paymentMethod);
  };

  return (
    <div className="py-12 sm:py-20 animate-fade-in-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-brand-card rounded-2xl shadow-2xl shadow-brand-primary/10 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">إضافة رصيد إلى حسابك</h2>
              <p className="text-gray-400 mt-2">اختر المبلغ وطريقة الدفع لإضافة رصيد إلى محفظتك.</p>
            </div>
            
            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-lg font-bold mb-3 text-gray-300">اختر المبلغ</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {predefinedAmounts.map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`p-4 rounded-lg transition-all duration-300 text-center font-semibold border-2 ${amount === val ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                placeholder="أو أدخل مبلغًا مخصصًا"
                className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-center"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-lg font-bold mb-4 text-gray-300">اختر طريقة الدفع</label>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex-1 p-3 rounded-lg transition-all duration-300 text-center font-semibold border-2 ${paymentMethod === option.id ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-brand-primary'}`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Button */}
            <button
              onClick={handleAddFunds}
              disabled={!paymentMethod || amount <= 0}
              className="w-full bg-brand-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 text-xl disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
            >
              المتابعة للدفع (${amount})
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;