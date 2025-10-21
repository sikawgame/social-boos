
import React from 'react';

const TestimonialCard: React.FC<{ name: string; username: string; text: string; avatar: string }> = ({ name, username, text, avatar }) => (
    <div className="bg-brand-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
        <img className="w-20 h-20 rounded-full mb-4 border-4 border-brand-primary" src={avatar} alt={name} />
        <p className="text-gray-300 flex-grow">"{text}"</p>
        <div className="mt-4">
            <h4 className="font-bold text-white">{name}</h4>
            <p className="text-sm text-brand-primary">{username}</p>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    const testimonialsData = [
        {
            name: 'علياء محمد',
            username: '@alia_style',
            text: 'خدمة رائعة! زاد عدد متابعي حسابي بشكل ملحوظ في وقت قصير جداً. موثوق وسريع.',
            avatar: 'https://picsum.photos/id/1027/200/200'
        },
        {
            name: 'خالد الغامدي',
            username: '@khaled_gamer',
            text: 'كنت متشككاً في البداية، لكن النتائج كانت مذهلة. مشاهدات فيديوهاتي على يوتيوب ارتفعت بشكل كبير!',
            avatar: 'https://picsum.photos/id/1005/200/200'
        },
        {
            name: 'سارة عبدالله',
            username: '@sara_cooks',
            text: 'أفضل موقع جربته على الإطلاق. دعم فني متعاون وخدمة لا يعلى عليها. أنصح به بشدة.',
            avatar: 'https://picsum.photos/id/1011/200/200'
        }
    ];

    return (
        <section className="py-20 bg-black bg-opacity-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">ماذا يقول عملاؤنا؟</h2>
                    <p className="mt-4 text-lg text-gray-400">نحن نفخر برضا عملائنا.</p>
                    <div className="mt-4 w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
