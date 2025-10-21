import React from 'react';

interface AboutUsProps {
    setView: (view: 'home') => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ setView }) => {
    return (
        <div className="py-12 sm:py-20 bg-brand-dark animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-brand-card p-8 sm:p-12 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">من نحن</h1>
                    <p className="text-gray-300 text-lg text-center mb-10">
                        في SocialBoost، نحن نؤمن بقوة التواصل الاجتماعي في بناء العلامات التجارية وتحقيق الأحلام. مهمتنا هي تزويدك بالأدوات والخدمات اللازمة للنمو والازدهار في العالم الرقمي.
                    </p>
                    
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
                        <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">مهمتنا</h2>
                        <p>
                            مهمتنا بسيطة: مساعدة المبدعين والعلامات التجارية والشركات على توسيع نطاق وصولهم وتأثيرهم على منصات التواصل الاجتماعي. نحن نقدم خدمات موثوقة وعالية الجودة وبأسعار معقولة لتمكينك من تحقيق أهدافك الرقمية، سواء كنت تبدأ من الصفر أو تتطلع إلى تعزيز وجودك الحالي.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">لماذا تختار SocialBoost؟</h2>
                        <ul className="space-y-4">
                            <li><strong>جودة لا تضاهى:</strong> نحن نركز على تقديم متابعين ومشاهدات وإعجابات حقيقية وعالية الجودة لضمان نمو عضوي وآمن لحساباتك.</li>
                            <li><strong>تنفيذ فوري:</strong> بمجرد تأكيد طلبك، يبدأ نظامنا الذكي في العمل فوراً لتقديم النتائج في أسرع وقت ممكن.</li>
                            <li><strong>أمان تام:</strong> خصوصيتك وأمان حسابك هما أولويتنا القصوى. نحن لا نطلب أبدًا كلمة المرور الخاصة بك، وجميع عمليات الدفع تتم عبر بوابات آمنة.</li>
                            <li><strong>دعم فني متميز:</strong> فريق الدعم لدينا متاح لمساعدتك والإجابة على استفساراتك في أي وقت. نحن هنا لضغان حصولك على أفضل تجربة ممكنة.</li>
                        </ul>
                    </div>
                    
                    <div className="text-center mt-12">
                        <button onClick={() => setView('home')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all">
                            العودة إلى الصفحة الرئيسية
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .prose-invert ul { list-style-type: '✔ '; padding-right: 1.5rem; }
                .prose-invert ul li::marker { color: #007BFF; }
            `}</style>
        </div>
    );
};

export default AboutUs;
