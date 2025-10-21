import React from 'react';
import type { View } from '../types';

interface ApiDocsProps {
    setView: (view: 'home' | 'settings') => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode; lang?: string }> = ({ children, lang = 'json' }) => (
    <pre className="bg-gray-900 rounded-md p-4 text-sm text-gray-300 overflow-x-auto my-4 text-left dir-ltr">
        <code className={`language-${lang}`}>
            {children}
        </code>
    </pre>
);

const ApiDocs: React.FC<ApiDocsProps> = ({ setView }) => {
    const exampleKey = "SB-KEY-172193..."

    return (
        <div className="py-12 sm:py-20 bg-brand-dark animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-brand-card p-8 sm:p-12 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">توثيق واجهة برمجة التطبيقات (API)</h1>
                    <p className="text-gray-400 text-center mb-10">
                        أتمتة طلباتك وادمج خدماتنا في تطبيقاتك الخاصة باستخدام واجهة برمجة التطبيقات (API) البسيطة الخاصة بنا.
                    </p>

                    <div className="prose prose-invert max-w-none text-gray-300 space-y-8">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">المصادقة</h2>
                            <p>
                                تتطلب جميع طلبات API مفتاح API صالحًا. يمكنك العثور على مفتاحك وإنشاء مفتاح جديد في صفحة <button onClick={() => setView('settings')} className="text-brand-primary hover:underline">إعدادات الحساب</button>.
                            </p>
                            <p>
                                يجب إرسال مفتاح API الخاص بك في ترويسة الطلب `X-API-Key`.
                            </p>
                            <CodeBlock lang="bash">
                                {`curl "https://socialboost.example.com/api/services" \\
  -H "X-API-Key: ${exampleKey}"`}
                            </CodeBlock>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white border-b-2 border-brand-primary pb-2">نقاط النهاية (Endpoints)</h2>
                            
                            <article className="mt-6">
                                <h3 className="text-xl font-semibold text-white">GET /api/services</h3>
                                <p>استرداد قائمة بجميع المنصات والخدمات المتاحة مع أسعارها وحدودها.</p>
                                <h4 className="font-bold text-gray-300 mt-2">استجابة ناجحة (مثال):</h4>
                                <CodeBlock>
{`{
    "success": true,
    "message": "Services retrieved successfully.",
    "data": {
        "instagram": {
            "id": "instagram",
            "name": "إنستغرام",
            "placeholder": "https://instagram.com/username",
            "services": {
                "followers": {
                    "name": "متابعين",
                    "pricePer1000": 5,
                    "min": 100,
                    "max": 10000
                },
                "likes": { ... }
            }
        },
        "tiktok": { ... }
    }
}`}
                                </CodeBlock>
                            </article>
                            
                            <article className="mt-6">
                                <h3 className="text-xl font-semibold text-white">POST /api/orders</h3>
                                <p>إنشاء طلب جديد. سيتم خصم التكلفة من رصيد حسابك.</p>
                                <h4 className="font-bold text-gray-300 mt-2">بيانات الطلب (Request Body):</h4>
                                <CodeBlock>
{`{
    "platformId": "tiktok",
    "serviceId": "views",
    "quantity": 50000,
    "link": "https://tiktok.com/@username/video/123..."
}`}
                                </CodeBlock>
                                <h4 className="font-bold text-gray-300 mt-2">استجابة ناجحة (مثال):</h4>
                                <CodeBlock>
{`{
    "success": true,
    "message": "Order placed successfully.",
    "data": {
        "id": "ORD1721936987179",
        "userEmail": "test@example.com",
        "date": "2024-07-25",
        "platform": "tiktok",
        "service": "مشاهدات",
        "quantity": 50000,
        "cost": 25,
        "link": "https://tiktok.com/@username/video/123...",
        "status": "Pending"
    }
}`}
                                </CodeBlock>
                            </article>
                            
                             <article className="mt-6">
                                <h3 className="text-xl font-semibold text-white">GET /api/orders/:id</h3>
                                <p>التحقق من حالة طلب معين باستخدام معرف الطلب الخاص به.</p>
                                <h4 className="font-bold text-gray-300 mt-2">استجابة ناجحة (مثال):</h4>
                                <CodeBlock>
{`{
    "success": true,
    "message": "Order status retrieved successfully.",
    "data": {
        "id": "ORD1721936987179",
        "userEmail": "test@example.com",
        "date": "2024-07-25",
        "platform": "tiktok",
        "service": "مشاهدات",
        "quantity": 50000,
        "cost": 25,
        "link": "https://tiktok.com/@username/video/123...",
        "status": "In Progress"
    }
}`}
                                </CodeBlock>
                            </article>
                        </section>
                    </div>

                    <div className="text-center mt-12">
                        <button onClick={() => setView('home')} className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-all">
                            العودة إلى الصفحة الرئيسية
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .prose-invert h2, .prose-invert h3 { color: #ffffff; }
                .prose-invert a { color: #007BFF; }
            `}</style>
        </div>
    );
};

export default ApiDocs;
