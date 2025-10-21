
import React from 'react';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="relative text-center p-6">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-brand-card rounded-full shadow-lg border-2 border-brand-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: (
                <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            title: 'اختر باقتك',
            description: 'تصفح خدماتنا المتنوعة واختر الباقة التي تناسب أهدافك وميزانيتك.'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            title: 'أدخل التفاصيل',
            description: 'أضف رابط حسابك أو منشورك. نحن لا نطلب كلمة المرور الخاصة بك أبداً.'
        },
        {
            icon: (
                <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'شاهد النتائج',
            description: 'استرخ وشاهد حسابك ينمو. تبدأ خدمتنا في العمل على الفور لتقديم النتائج.'
        }
    ];

  return (
    <section id="how-it-works" className="py-20 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">كيف نعمل؟</h2>
                <p className="mt-4 text-lg text-gray-400">ثلاث خطوات بسيطة لتحقيق الشهرة.</p>
                <div className="mt-4 w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
            </div>
            <div className="relative">
                 <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2"></div>
                 <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-primary -translate-y-1/2" style={{clipPath: 'polygon(0 0, 33% 0, 66% 100%, 0% 100%)'}}></div>


                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => <Step key={index} {...step} />)}
                </div>
            </div>
        </div>
    </section>
  );
};

export default HowItWorks;
