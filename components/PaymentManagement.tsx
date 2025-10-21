import React, { useState } from 'react';
import type { Bank, PaymentSettings, View } from '../types';

interface PaymentManagementProps {
    settings: PaymentSettings;
    onUpdateSettings: (newSettings: PaymentSettings) => void;
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

const PaymentManagement: React.FC<PaymentManagementProps> = ({ settings, onUpdateSettings, setView }) => {
    const [banks, setBanks] = useState<Bank[]>(settings.banks);
    const [newBankName, setNewBankName] = useState('');
    const [newBankIban, setNewBankIban] = useState('');
    const [newBankHolderName, setNewBankHolderName] = useState('');

    const handleAddBank = () => {
        if (newBankName.trim() === '' || newBankIban.trim() === '' || newBankHolderName.trim() === '') {
            alert('الرجاء إدخال اسم البنك، اسم صاحب الحساب، ورقم IBAN.');
            return;
        }
        const newBank: Bank = {
            id: newBankName.toLowerCase().replace(/\s/g, '_') + '_' + Date.now(),
            name: newBankName.trim(),
            iban: newBankIban.trim(),
            accountHolderName: newBankHolderName.trim(),
        };
        setBanks([...banks, newBank]);
        setNewBankName('');
        setNewBankIban('');
        setNewBankHolderName('');
    };

    const handleDeleteBank = (bankId: string) => {
        setBanks(banks.filter(bank => bank.id !== bankId));
    };
    
    const handleBankNameChange = (bankId: string, newName: string) => {
        setBanks(banks.map(bank => (bank.id === bankId ? { ...bank, name: newName } : bank)));
    };

    const handleBankHolderNameChange = (bankId: string, newName: string) => {
        setBanks(banks.map(bank => (bank.id === bankId ? { ...bank, accountHolderName: newName } : bank)));
    };

    const handleBankIbanChange = (bankId: string, newIban: string) => {
        setBanks(banks.map(bank => (bank.id === bankId ? { ...bank, iban: newIban } : bank)));
    };

    const handleSaveChanges = () => {
        if (banks.some(bank => bank.name.trim() === '' || bank.iban.trim() === '' || bank.accountHolderName.trim() === '')) {
            alert('لا يمكن ترك أي حقل فارغًا لأي بنك.');
            return;
        }
        const newSettings: PaymentSettings = {
            banks: banks,
        };
        onUpdateSettings(newSettings);
    };
    
    const isChanged = JSON.stringify(banks) !== JSON.stringify(settings.banks);

    return (
        <div className="py-12 sm:py-20 bg-black bg-opacity-20 animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">إدارة طرق الدفع</h1>
                            <p className="text-gray-400">تحديث البنوك المتاحة ومعلومات الحسابات الخاصة بها.</p>
                        </div>
                        <button onClick={() => setView('admin')} className="text-brand-primary hover:underline">
                            &larr; العودة إلى لوحة تحكم المسؤول
                        </button>
                    </div>

                    <div className="space-y-8">
                        <SettingsCard title="البنوك المتاحة وحسابات IBAN">
                             <div className="space-y-6">
                                {banks.map(bank => (
                                    <div key={bank.id} className="bg-gray-800 p-4 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <input
                                                type="text"
                                                value={bank.name}
                                                onChange={(e) => handleBankNameChange(bank.id, e.target.value)}
                                                placeholder="اسم البنك"
                                                className="text-white font-semibold p-2 bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:border-brand-primary w-1/3"
                                            />
                                            <button onClick={() => handleDeleteBank(bank.id)} className="text-red-500 hover:text-red-400 font-bold p-2 flex-shrink-0">
                                                &#x2715;
                                            </button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                value={bank.accountHolderName}
                                                onChange={(e) => handleBankHolderNameChange(bank.id, e.target.value)}
                                                placeholder="اسم صاحب الحساب"
                                                className="w-full p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                            />
                                            <input
                                                type="text"
                                                value={bank.iban}
                                                onChange={(e) => handleBankIbanChange(bank.id, e.target.value)}
                                                placeholder="رقم IBAN"
                                                className="w-full p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="space-y-3 pt-4 border-t border-gray-700">
                                    <h4 className="text-lg font-semibold text-white">إضافة بنك جديد</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={newBankName}
                                            onChange={(e) => setNewBankName(e.target.value)}
                                            placeholder="اسم البنك الجديد"
                                            className="p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                        />
                                        <input
                                            type="text"
                                            value={newBankHolderName}
                                            onChange={(e) => setNewBankHolderName(e.target.value)}
                                            placeholder="اسم صاحب الحساب"
                                            className="p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={newBankIban}
                                        onChange={(e) => setNewBankIban(e.target.value)}
                                        placeholder="رقم IBAN الجديد"
                                        className="w-full p-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-brand-primary"
                                    />
                                    <button onClick={handleAddBank} className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-500">
                                        إضافة البنك
                                    </button>
                                </div>
                            </div>
                        </SettingsCard>
                        
                        <div className="text-left">
                             <button 
                                onClick={handleSaveChanges}
                                disabled={!isChanged}
                                className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-brand-primary/30 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentManagement;