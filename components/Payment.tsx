import React, { useState } from 'react';
import type { OrderDetails, User, PaymentSettings, Bank } from '../types';
import { addFundTransferRequest } from '../services/databaseService';

interface PaymentProps {
  orderDetails: OrderDetails;
  setView: (view: 'home' | 'dashboard' | 'payment' | 'addFunds') => void;
  onPaymentComplete: (details: OrderDetails) => void;
  currentUser: User;
  paymentSettings: PaymentSettings;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const BalancePaymentFlow: React.FC<{ orderDetails: OrderDetails, currentUser: User, onComplete: () => void, onAddFunds: () => void }> = ({ orderDetails, currentUser, onComplete, onAddFunds }) => {
    const hasSufficientFunds = currentUser.balance >= orderDetails.cost;

    return (
        <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">الدفع باستخدام الرصيد</h3>
            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-400">رصيدك الحالي:</span>
                    <span className="font-bold text-white">${currentUser.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg mt-2">
                    <span className="text-gray-400">تكلفة الطلب:</span>
                    <span className="font-bold text-brand-primary">-${orderDetails.cost.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 my-3"></div>
                <div className={`flex justify-between items-center text-lg font-bold ${hasSufficientFunds ? 'text-green-400' : 'text-red-500'}`}>
                    <span className="">الرصيد المتبقي:</span>
                    <span>${(currentUser.balance - orderDetails.cost).toFixed(2)}</span>
                </div>
            </div>

            {hasSufficientFunds ? (
                <button 
                    onClick={onComplete}
                    className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300"
                >
                    تأكيد الدفع
                </button>
            ) : (
                <div>
                    <p className="text-red-500 mb-4">ليس لديك رصيد كافٍ لإتمام هذه العملية.</p>
                    <button 
                        onClick={onAddFunds}
                        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-600/30 transform hover:scale-105 transition-all duration-300"
                    >
                        إضافة رصيد
                    </button>
                </div>
            )}
        </div>
    );
};

const BankTransferFlow: React.FC<{ onComplete: (screenshot: File, bank: Bank) => void, orderDetails: OrderDetails, paymentSettings: PaymentSettings }> = ({ onComplete, orderDetails, paymentSettings }) => {
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotName, setScreenshotName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
            setScreenshotName(e.target.files[0].name);
        }
    };

    return (
        <div className="space-y-6">
            {!selectedBank ? (
                <div>
                    <h3 className="text-xl font-bold text-white mb-4 text-center">1. اختر البنك الذي ستقوم بالتحويل إليه</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {paymentSettings.banks.map(bank => (
                            <button key={bank.id} onClick={() => setSelectedBank(bank)} className="p-4 bg-gray-700 rounded-lg text-white font-semibold hover:bg-brand-primary transition-colors duration-300">
                                {bank.name}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in-down">
                     <h3 className="text-xl font-bold text-white mb-4 text-center">2. قم بالتحويل وأرفق الإثبات</h3>
                     <div className="bg-gray-800 p-4 rounded-lg text-center mb-6">
                        <p className="text-gray-400">يرجى تحويل مبلغ <strong className="text-brand-primary">${orderDetails.cost.toFixed(2)}</strong> إلى الحساب التالي:</p>
                        <div className="mt-2 text-white">
                            <p><span className="font-semibold">اسم صاحب الحساب:</span> {selectedBank.accountHolderName}</p>
                            <p><span className="font-semibold">رقم الآيبان (IBAN):</span> {selectedBank.iban}</p>
                            <p><span className="font-semibold">البنك:</span> {selectedBank.name}</p>
                        </div>
                     </div>
                     
                    <div>
                        <label htmlFor="screenshot-upload" className="block text-lg font-bold mb-2 text-gray-300 text-center">إثبات التحويل</label>
                        <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-600 px-6 pt-5 pb-6">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                <div className="flex text-sm text-gray-500 justify-center">
                                    <label htmlFor="screenshot-upload" className="relative cursor-pointer rounded-md bg-gray-800 font-medium text-brand-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-brand-accent px-1">
                                        <span>قم برفع ملف</span>
                                        <input id="screenshot-upload" name="screenshot-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="pr-1">أو اسحبه وأفلته هنا</p>
                                </div>
                                {screenshotName ? (
                                    <p className="text-xs text-green-400 pt-2">{screenshotName}</p>
                                ) : (
                                    <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => onComplete(screenshot!, selectedBank)} disabled={!screenshot} className="mt-6 w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none">
                        تأكيد وإرسال الإثبات
                    </button>
                    <button onClick={() => setSelectedBank(null)} className="mt-2 w-full text-gray-400 hover:text-white transition-colors">
                        العودة لاختيار البنك
                    </button>
                </div>
            )}
        </div>
    );
};


const Payment: React.FC<PaymentProps> = ({ orderDetails, setView, onPaymentComplete, currentUser, paymentSettings }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleRegularSubmission = () => {
        onPaymentComplete(orderDetails);
        setIsSubmitted(true);
    };

    const handleBankTransferComplete = async (screenshot: File, bank: Bank) => {
        const screenshotDataUrl = await fileToDataUrl(screenshot);
        
        if (orderDetails.service === 'إضافة رصيد') {
            // This is a fund request, it needs admin approval
            addFundTransferRequest(currentUser.email, orderDetails.cost, bank, screenshotDataUrl);
            // We don't call onPaymentComplete here because the balance isn't updated yet.
            // We just show the success message.
            setIsSubmitted(true);
        } else {
            // This is a regular order paid by bank transfer.
            // For now, we'll treat it like other orders, creating a "Pending" order.
            // The screenshot isn't stored with the order in this simplified system,
            // but the admin would see the pending order and manually verify.
            onPaymentComplete(orderDetails);
            setIsSubmitted(true);
        }
    };

    if (!orderDetails || !paymentSettings) {
        return (
            <div className="py-20 text-center">
                <p className="text-xl text-gray-400">حدث خطأ. لم يتم العثور على تفاصيل الطلب.</p>
                <button onClick={() => setView('home')} className="mt-4 bg-brand-primary text-white font-bold py-2 px-6 rounded-lg">العودة للرئيسية</button>
            </div>
        );
    }
    
    if (isSubmitted) {
        const successMessage = orderDetails.service === 'إضافة رصيد' && orderDetails.paymentMethod === 'bank_transfer'
            ? 'تم استلام طلبك لإضافة الرصيد. ستتم مراجعته من قبل الإدارة وسيتم تحديث رصيدك عند الموافقة.'
            : 'لقد استلمنا طلبك. سيتم التحقق منه والبدء في تنفيذه قريباً.';
            
        return (
             <div className="py-20 text-center max-w-2xl mx-auto animate-fade-in-down">
                <div className="bg-brand-card p-8 rounded-2xl shadow-2xl">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-3xl font-bold text-white mb-2">شكراً لك!</h2>
                    <p className="text-gray-400 mb-6">{successMessage}</p>
                    <button onClick={() => setView('dashboard')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all">الذهاب إلى لوحة التحكم</button>
                </div>
            </div>
        )
    }

    const renderPaymentFlow = () => {
        switch (orderDetails.paymentMethod) {
            case 'balance':
                 return <BalancePaymentFlow 
                            orderDetails={orderDetails} 
                            currentUser={currentUser} 
                            onComplete={handleRegularSubmission} 
                            onAddFunds={() => setView('addFunds')}
                        />;
            case 'bank_transfer':
                return <BankTransferFlow onComplete={handleBankTransferComplete} orderDetails={orderDetails} paymentSettings={paymentSettings} />;
            case 'paypal':
                return (
                    <div className="text-center">
                         <h3 className="text-xl font-bold text-white mb-4">الدفع عبر PayPal</h3>
                         <p className="text-gray-400 mb-6">سيتم إعادة توجيهك إلى موقع PayPal لإكمال عملية الدفع بأمان.</p>
                         <button onClick={handleRegularSubmission} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">المتابعة إلى PayPal</button>
                    </div>
                );
            case 'credit_card':
                 return (
                    <div className="text-center">
                         <h3 className="text-xl font-bold text-white mb-4">الدفع بالبطاقة الائتمانية</h3>
                         <p className="text-gray-400 mb-6">سيتم فتح نافذة آمنة لإدخال تفاصيل بطاقتك الائتمانية.</p>
                         <button onClick={handleRegularSubmission} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">المتابعة للدفع</button>
                    </div>
                );
            default:
                return <p>طريقة دفع غير معروفة.</p>;
        }
    }

  return (
    <div className="py-12 sm:py-20 animate-fade-in-down">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-brand-card rounded-2xl shadow-2xl shadow-brand-primary/10 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-6 pb-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">إكمال الدفع</h2>
                        <p className="text-gray-400 mt-2">
                           {orderDetails.service === 'إضافة رصيد' 
                            ? `أنت على وشك إضافة رصيد بقيمة`
                            : `أنت على وشك طلب ${orderDetails.quantity.toLocaleString()} ${orderDetails.service} لمنصة ${orderDetails.platform}.`
                          }
                        </p>
                         <p className="text-3xl font-black text-brand-primary mt-2 tracking-wider">${orderDetails.cost.toFixed(2)}</p>
                    </div>

                    {renderPaymentFlow()}

                    <div className="mt-6 text-center">
                        <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">إلغاء الطلب والعودة</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Payment;