import React from 'react';

// FIX: Centralized shared types to avoid duplication and fix import errors.
export type View = 'home' | 'payment' | 'dashboard' | 'privacy' | 'terms' | 'about' | 'addFunds' | 'admin' | 'settings' | 'admin/prices' | 'admin/payments' | 'admin/funds' | 'api';
export type AuthModalView = 'login' | 'signup' | 'forgotPassword';
export interface User {
  name: string;
  email: string;
  balance: number;
  apiKey: string;
  profilePicture?: string;
}

export interface Service {
  name: string;
  pricePer1000: number;
  min: number;
  max: number;
}

export interface Platform {
  id: string;
  name: string;
  // FIX: Import React to use React.ReactNode type.
  icon: React.ReactNode;
  services: Record<string, Service>;
  placeholder: string;
}

export interface Order {
  id: string;
  userEmail: string;
  date: string;
  platform: string;
  service: string;
  link: string;
  quantity: number;
  cost: number;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface OrderDetails {
  platform: string;
  service: string;
  quantity: number;
  cost: number;
  link: string;
  paymentMethod: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface Bank {
    id: string;
    name: string;
    iban: string;
    accountHolderName: string;
}

export interface PaymentSettings {
    banks: Bank[];
}

export interface FundTransferRequest {
  id: string;
  userEmail: string;
  amount: number;
  bankId: string;
  bankName: string;
  screenshotDataUrl: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Message {
  id: string;
  userEmail: string;
  from: 'Admin';
  message: string;
  date: string;
  read: boolean;
}
