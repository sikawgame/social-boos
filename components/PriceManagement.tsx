import React, { useState, useEffect } from 'react';
import type { Platform, View } from '../types';

interface PriceManagementProps {
    platforms: Record<string, Platform>;
    onUpdatePrice: (platformId: string, serviceId: string, newPrice: number) => void;
    setView: (view: View) => void;
}

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-brand-card rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const PriceManagement: React.FC<PriceManagementProps> = ({ platforms, onUpdatePrice, setView }) => {
    // State to hold the string values from input fields for each service
    const [priceInputs, setPriceInputs] = useState<Record<string, Record<string, string>>>({});

    // Initialize the price inputs state when the component mounts or platforms data changes
    useEffect(() => {
        const initialInputs: Record<string, Record<string, string>> = {};
        for (const platformId in platforms) {
            initialInputs[platformId] = {};
            for (const serviceId in platforms[platformId].services) {
                initialInputs[platformId][serviceId] = platforms[platformId].services[serviceId].pricePer1000.toString();
            }
        }
        setPriceInputs(initialInputs);
    }, [platforms]);

    const handleInputChange = (platformId: string, serviceId: string, value: string) => {
        setPriceInputs(prev => ({
            ...prev,
            [platformId]: {
                ...prev[platformId],
                [serviceId]: value,
            }
        }));
    };

    const handleSave = (platformId: string, serviceId: string) => {
        const newPriceString = priceInputs[platformId]?.[serviceId];
        const newPrice = parseFloat(newPriceString);

        if (!isNaN(newPrice) && newPrice >= 0) {
            onUpdatePrice(platformId, serviceId, newPrice);
        } else {
            alert('الرجاء إدخال سعر صالح.');
        }
    };

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">إدارة أسعار الخدمات</h1>
                            <p className="text-gray-400">تحديث أسعار الخدمات لكل 1000 وحدة.</p>
                        </div>
                         <button onClick={() => setView('admin')} className="text-brand-primary hover:underline">
                            &larr; العودة إلى لوحة تحكم المسؤول
                        </button>
                    </div>

                    <div className="space-y-8">
                        {Object.values(platforms).map(platform => (
                            <SettingsCard key={platform.id} title={platform.name}>
                                <div className="space-y-4">
                                    {Object.entries(platform.services).map(([serviceId, service]) => (
                                        <div key={serviceId} className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <span className="text-gray-300 font-semibold">{service.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">$</span>
                                                <input 
                                                    type="number"
                                                    value={priceInputs[platform.id]?.[serviceId] || ''}
                                                    onChange={(e) => handleInputChange(platform.id, serviceId, e.target.value)}
                                                    step="0.01"
                                                    min="0"
                                                    className="w-28 p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white text-center focus:outline-none focus:border-brand-primary"
                                                />
                                                <span className="text-gray-400">/ 1000</span>
                                                <button 
                                                    onClick={() => handleSave(platform.id, serviceId)}
                                                    className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-500"
                                                    disabled={parseFloat(priceInputs[platform.id]?.[serviceId]) === service.pricePer1000}
                                                >
                                                    حفظ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SettingsCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceManagement;
