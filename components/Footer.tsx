import React from 'react';

interface FooterProps {
  setView: (view: 'home' | 'privacy' | 'terms' | 'about') => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer id="contact" className="bg-brand-card text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4"><span className="text-brand-primary">Social</span>Boost</h3>
            <p>أفضل حلول النمو لوسائل التواصل الاجتماعي. نحن هنا لمساعدتك على تحقيق أهدافك.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); setView('home'); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-brand-primary transition-colors">الرئيسية</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); setView('home'); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-brand-primary transition-colors">الخدمات</a></li>
              <li><a href="#order" onClick={(e) => { e.preventDefault(); setView('home'); document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-brand-primary transition-colors">اطلب الآن</a></li>
              <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); setView('home'); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-brand-primary transition-colors">كيف نعمل</a></li>
              <li><button onClick={() => setView('about')} className="hover:text-brand-primary transition-colors text-right w-full">من نحن</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">قانوني</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setView('privacy')} className="hover:text-brand-primary transition-colors text-right w-full">سياسة الخصوصية</button></li>
              <li><button onClick={() => setView('terms')} className="hover:text-brand-primary transition-colors text-right w-full">شروط الخدمة</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@socialboost.com" className="hover:text-brand-primary transition-colors">support@socialboost.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} SocialBoost. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;