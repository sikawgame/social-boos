
import React from 'react';

const Hero: React.FC = () => {
  const handleScrollTo = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-brand-dark pt-24 pb-32 text-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-brand-primary/10 bg-grid-20 [mask-image:linear-gradient(to_bottom,white_0,white_75%,transparent_100%)]"></div>
       <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(40%_50%_at_top_center,white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/30 to-transparent"></div>
       </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight animate-fade-in-down">
          عزز حضورك على <span className="text-brand-primary">مواقع التواصل الاجتماعي</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 animate-fade-in-up">
          نقدم خدمات عالية الجودة لزيادة متابعيك، إعجاباتك، ومشاهداتك على جميع المنصات الكبرى. ابدأ الآن وشاهد الفرق.
        </p>
        <div className="mt-10 flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => handleScrollTo('#order')}
            className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300"
          >
            اطلب الآن
          </button>
          <button
            onClick={() => handleScrollTo('#how-it-works')}
            className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-gray-700/30 transform hover:scale-105 transition-all duration-300"
          >
            اعرف المزيد
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
