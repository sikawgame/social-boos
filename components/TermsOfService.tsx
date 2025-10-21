import React from 'react';

interface TermsOfServiceProps {
    setView: (view: 'home') => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ setView }) => {
    return (
        <div className="py-12 sm:py-20 bg-brand-dark animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-brand-card p-8 sm:p-12 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">شروط الخدمة</h1>
                    <p className="text-gray-400 text-center mb-8">آخر تحديث: 25 يوليو 2024</p>
                    
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                        <h2 className="text-2xl font-bold text-white">1. قبول الشروط</h2>
                        <p>
                           باستخدام موقع SocialBoost وخدماته، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-white">2. استخدام الخدمات</h2>
                        <ul>
                            <li>يجب أن يكون عمرك 18 عامًا على الأقل لاستخدام خدماتنا.</li>
                            <li>أنت مسؤول عن أي نشاط يحدث تحت حسابك.</li>
                            <li>يُحظر استخدام خدماتنا لأي غرض غير قانوني أو للترويج لأنشطة غير قانونية.</li>
                            <li>نحن لا نضمن أن زيادة المتابعين أو الإعجابات ستؤدي إلى زيادة المبيعات أو الشعبية.</li>
                        </ul>
                        
                        <h2 className="text-2xl font-bold text-white">3. الحسابات</h2>
                        <p>
                            عند إنشاء حساب معنا، يجب عليك تزويدنا بمعلومات دقيقة وكاملة. أنت مسؤول عن حماية كلمة المرور الخاصة بك.
                        </p>

                        <h2 className="text-2xl font-bold text-white">4. الطلبات والدفع</h2>
                        <ul>
                            <li>جميع المبيعات نهائية وغير قابلة للاسترداد بمجرد بدء تنفيذ الطلب.</li>
                            <li>أوقات التسليم المذكورة على موقعنا هي تقديرات وقد تختلف.</li>
                            <li>نحن لسنا مسؤولين عن أي حظر أو تعليق لحسابك من قبل منصات التواصل الاجتماعي. استخدام خدماتنا على مسؤوليتك الخاصة.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white">5. تحديد المسؤولية</h2>
                        <p>
                           لن يكون SocialBoost مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، بما في ذلك على سبيل المثال لا الحصر، خسارة الأرباح أو البيانات.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-white">6. اتصل بنا</h2>
                        <p>
                           إذا كان لديك أي أسئلة حول هذه الشروط، يمكنك الاتصال بنا على <a href="mailto:support@socialboost.com" className="text-brand-primary hover:underline">support@socialboost.com</a>.
                        </p>
                    </div>
                    
                    <div className="text-center mt-12">
                        <button onClick={() => setView('home')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all">
                            العودة إلى الصفحة الرئيسية
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .prose-invert ul { list-style-type: disc; padding-right: 1.5rem; }
                .prose-invert a { color: #007BFF; }
            `}</style>
        </div>
    );
};

export default TermsOfService;
