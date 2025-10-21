import React from 'react';

interface PrivacyPolicyProps {
    setView: (view: 'home') => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setView }) => {
    return (
        <div className="py-12 sm:py-20 bg-brand-dark animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-brand-card p-8 sm:p-12 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">سياسة الخصوصية</h1>
                    <p className="text-gray-400 text-center mb-8">آخر تحديث: 25 يوليو 2024</p>
                    
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                        <p>
                            مرحبًا بك في SocialBoost ("نحن"، "الخاص بنا"). نحن ملتزمون بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيف نجمع، نستخدم، ونكشف عن معلوماتك عند استخدامك لموقعنا وخدماتنا.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-white">1. المعلومات التي نجمعها</h2>
                        <p>
                            قد نجمع أنواعًا مختلفة من المعلومات فيما يتعلق باستخدامك لخدماتنا، بما في ذلك:
                        </p>
                        <ul>
                            <li><strong>المعلومات الشخصية:</strong> مثل اسمك وعنوان بريدك الإلكتروني الذي تقدمه عند إنشاء حساب.</li>
                            <li><strong>معلومات الطلب:</strong> مثل روابط وسائل التواصل الاجتماعي، نوع الخدمة المختارة، والكمية. نحن لا نطلب أبدًا كلمة المرور الخاصة بك.</li>
                            <li><strong>بيانات الاستخدام:</strong> معلومات حول كيفية تفاعلك مع موقعنا، مثل الصفحات التي تزورها والإجراءات التي تتخذها.</li>
                        </ul>
                        
                        <h2 className="text-2xl font-bold text-white">2. كيف نستخدم معلوماتك</h2>
                        <p>
                            نستخدم المعلومات التي نجمعها للأغراض التالية:
                        </p>
                        <ul>
                            <li>لتقديم وإدارة خدماتنا وتنفيذ طلباتك.</li>
                            <li>للتواصل معك بخصوص حسابك أو طلباتك.</li>
                            <li>لتحسين موقعنا وخدماتنا.</li>
                            <li>لمنع الاحتيال وضمان أمن منصتنا.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-white">3. مشاركة المعلومات</h2>
                        <p>
                            نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
                        </p>
                        <ul>
                            <li>مع مزودي الخدمة الذين يساعدوننا في تشغيل أعمالنا (مثل معالجي الدفع).</li>
                            <li>إذا طُلب منا ذلك بموجب القانون أو لحماية حقوقنا.</li>
                        </ul>
                        
                        <h2 className="text-2xl font-bold text-white">4. أمن البيانات</h2>
                        <p>
                           نحن نتخذ تدابير معقولة لحماية معلوماتك من الوصول غير المصرح به أو الكشف عنها. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو تخزين إلكتروني آمنة بنسبة 100%.
                        </p>

                        <h2 className="text-2xl font-bold text-white">5. اتصل بنا</h2>
                        <p>
                           إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك الاتصال بنا على <a href="mailto:support@socialboost.com" className="text-brand-primary hover:underline">support@socialboost.com</a>.
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

export default PrivacyPolicy;
