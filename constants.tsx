import React from 'react';
import type { Platform, Bank, PaymentSettings } from './types';

const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const FacebookIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const YoutubeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.582 7.336a2.493 2.493 0 0 0-1.756-1.756C18.25 5.25 12 5.25 12 5.25s-6.25 0-7.826.33A2.493 2.493 0 0 0 2.418 7.336 26.02 26.02 0 0 0 2.088 12c0 2.56.12 4.664.33 4.664.13.67.683 1.223 1.354 1.354C5.75 18.75 12 18.75 12 18.75s6.25 0 7.826-.33a2.493 2.493 0 0 0 1.756-1.756c.33-1.576.33-4.664.33-4.664s0-3.088-.33-4.664zM9.75 14.85V9.15L15.21 12 9.75 14.85z"></path>
    </svg>
);

const TiktokIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.92-2.31-4.42-1.99-6.83.32-2.45 1.52-4.64 3.44-6.16 2.02-1.59 4.54-2.22 7.02-1.74-.01 2.33-.02 4.65-.02 6.98-.95-.29-1.9-.58-2.85-.85-1.14-.33-2.28-.56-3.43-.73v-4.3c1.45.1 2.9.33 4.31.73 1.14.33 2.24.77 3.21 1.29v-4.44c-.66-.46-1.36-.88-2.09-1.25-1.12-.56-2.29-.9-3.48-1.11Z"></path>
    </svg>
);

export const DEFAULT_PLATFORMS: Record<string, Platform> = {
    instagram: {
        id: 'instagram',
        name: 'إنستغرام',
        icon: <InstagramIcon className="w-16 h-16 mx-auto mb-4 text-pink-500" />,
        placeholder: 'https://instagram.com/username',
        services: {
            followers: { name: 'متابعين', pricePer1000: 5.00, min: 100, max: 10000 },
            likes: { name: 'لايكات', pricePer1000: 2.50, min: 50, max: 5000 },
            views: { name: 'مشاهدات', pricePer1000: 1.00, min: 100, max: 100000 },
        }
    },
    tiktok: {
        id: 'tiktok',
        name: 'تيك توك',
        icon: <TiktokIcon className="w-16 h-16 mx-auto mb-4 text-white" />,
        placeholder: 'https://tiktok.com/@username/video/123...',
        services: {
            followers: { name: 'متابعين', pricePer1000: 6.00, min: 100, max: 20000 },
            likes: { name: 'لايكات', pricePer1000: 3.00, min: 50, max: 10000 },
            views: { name: 'مشاهدات', pricePer1000: 0.50, min: 1000, max: 1000000 },
        }
    },
    youtube: {
        id: 'youtube',
        name: 'يوتيوب',
        icon: <YoutubeIcon className="w-16 h-16 mx-auto mb-4 text-red-600" />,
        placeholder: 'https://youtube.com/watch?v=...',
        services: {
            subscribers: { name: 'مشتركين', pricePer1000: 25.00, min: 100, max: 5000 },
            views: { name: 'مشاهدات', pricePer1000: 4.00, min: 1000, max: 500000 },
            likes: { name: 'لايكات', pricePer1000: 10.00, min: 100, max: 10000 },
        }
    },
    facebook: {
        id: 'facebook',
        name: 'فيسبوك',
        icon: <FacebookIcon className="w-16 h-16 mx-auto mb-4 text-blue-600" />,
        placeholder: 'https://facebook.com/yourpage',
        services: {
            page_likes: { name: 'إعجابات بالصفحة', pricePer1000: 8.00, min: 100, max: 10000 },
            post_likes: { name: 'لايكات للمنشور', pricePer1000: 4.00, min: 100, max: 5000 },
            views: { name: 'مشاهدات فيديو', pricePer1000: 2.00, min: 1000, max: 200000 },
        }
    }
};

export const DEFAULT_BANKS: Bank[] = [
    { id: 'rajhi', name: 'الراجحي', iban: 'SA0380000000608010167519', accountHolderName: 'مؤسسة SocialBoost' },
    { id: 'alahli', name: 'الأهلي', iban: 'SA1110000000123456789012', accountHolderName: 'مؤسسة SocialBoost' },
    { id: 'riyad', name: 'الرياض', iban: 'SA2220000000987654321098', accountHolderName: 'مؤسسة SocialBoost' },
    { id: 'alinma', name: 'الإنماء', iban: 'SA3305000000112233445566', accountHolderName: 'مؤسسة SocialBoost' },
];

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
    banks: DEFAULT_BANKS,
};