
import React, { useState } from 'react';
import { generateTikTokIdeas } from '../services/geminiService';

const IdeaGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('الرجاء إدخال موضوع للحصول على أفكار.');
            return;
        }
        setLoading(true);
        setError(null);
        setIdeas([]);
        try {
            const result = await generateTikTokIdeas(topic);
            setIdeas(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('حدث خطأ غير متوقع.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-brand-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        مولد أفكار <span className="text-brand-accent">تيك توك</span> بالذكاء الاصطناعي
                    </h2>
                    <p className="mt-4 text-lg text-gray-400">
                        هل تحتاج إلى إلهام؟ أدخل موضوعك ودع الذكاء الاصطناعي يساعدك في إنشاء أفكار فيديوهات رائجة.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="مثال: نصائح للطبخ السريع"
                            className="flex-grow p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-brand-accent/30 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {loading ? '...جاري التفكير' : 'إنشاء أفكار'}
                        </button>
                    </div>

                    {error && <p className="mt-4 text-red-500">{error}</p>}

                    {ideas.length > 0 && (
                        <div className="mt-10 text-right bg-brand-card p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4">إليك بعض الأفكار:</h3>
                            <ul className="space-y-3 list-decimal list-inside">
                                {ideas.map((idea, index) => (
                                    <li key={index} className="text-gray-300">{idea}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default IdeaGenerator;
