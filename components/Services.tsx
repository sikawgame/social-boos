import React from 'react';
import { Platform } from '../types';

interface ServicesProps {
    platforms: Record<string, Platform>;
}

const Services: React.FC<ServicesProps> = ({ platforms }) => {
  return (
    <section id="services" className="py-20 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">خدماتنا</h2>
          <p className="mt-4 text-lg text-gray-400">ندعم جميع المنصات التي تحتاجها للنمو.</p>
          <div className="mt-4 w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* FIX: Add explicit type to 'platform' to resolve properties on 'unknown' type error. */}
          {Object.values(platforms).map((platform: Platform) => (
            <div key={platform.id} className="text-center p-6 bg-brand-card rounded-xl shadow-lg hover:shadow-brand-primary/30 transition-shadow duration-300 transform hover:-translate-y-2">
              {platform.icon}
              <h3 className="text-xl font-bold mt-2 text-white">{platform.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
