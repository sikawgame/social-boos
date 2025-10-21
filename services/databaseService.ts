import type { Order, OrderDetails, User as AppUser, Platform, PaymentSettings, Bank, FundTransferRequest, Message } from '../types';
import { DEFAULT_PLATFORMS, DEFAULT_PAYMENT_SETTINGS } from '../constants';
import { notificationService } from './notificationService';

// --- LocalStorage Keys ---
const DB_USERS_KEY = 'socialboost_users';
const DB_ORDERS_KEY = 'socialboost_orders';
const DB_SESSION_KEY = 'socialboost_session';
const DB_PRICES_KEY = 'socialboost_prices';
const DB_PAYMENT_SETTINGS_KEY = 'socialboost_payment_settings';
const DB_FUND_REQUESTS_KEY = 'socialboost_fund_requests';
const DB_MESSAGES_KEY = 'socialboost_messages';


// --- User Type (for internal use) ---
interface User {
  name: string;
  email: string;
  passwordHash: string; // In a real app, this would be a hash, not plaintext
  balance: number;
  profilePicture?: string;
}

// --- Utility Functions ---
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const setToStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error)
    {
    console.error(`Error setting localStorage key “${key}”:`, error);
  }
};

// --- Database Initialization ---
const initPricesDB = () => {
    const prices = window.localStorage.getItem(DB_PRICES_KEY);
    if (!prices) {
        // We need to strip the JSX icon before storing in JSON
        const platformsForStorage = Object.fromEntries(
            Object.entries(DEFAULT_PLATFORMS).map(([key, platform]) => {
                const { icon, ...rest } = platform;
                return [key, rest];
            })
        );
        setToStorage(DB_PRICES_KEY, platformsForStorage);
    }
}

const initPaymentSettingsDB = () => {
    const settings = window.localStorage.getItem(DB_PAYMENT_SETTINGS_KEY);
    if (!settings) {
        setToStorage(DB_PAYMENT_SETTINGS_KEY, DEFAULT_PAYMENT_SETTINGS);
    }
}

export const initDB = () => {
  // Initialize with a default user and some orders if the DB is empty
  let users = getFromStorage<User[]>(DB_USERS_KEY, []);
  if (users.length === 0) {
    const defaultUser = {
      name: 'المستخدم التجريبي',
      email: 'test@example.com',
      passwordHash: 'password123', // WARNING: Storing plaintext passwords is insecure. This is for simulation only.
      balance: 50.00,
      profilePicture: undefined,
    };
     const adminUser = {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'admin123',
      balance: 9999.00,
      profilePicture: undefined,
    };
    users = [defaultUser, adminUser];
    setToStorage(DB_USERS_KEY, users);
  }

  const orders = getFromStorage<Order[]>(DB_ORDERS_KEY, []);
  if (orders.length === 0) {
    const MOCK_ORDERS: Omit<Order, 'id'>[] = [
        { userEmail: 'test@example.com', date: '2024-07-20', platform: 'instagram', service: 'متابعين', quantity: 5000, cost: 25.00, status: 'Completed', link: 'https://instagram.com/testuser' },
        { userEmail: 'test@example.com', date: '2024-07-21', platform: 'tiktok', service: 'مشاهدات', quantity: 100000, cost: 50.00, status: 'Completed', link: 'https://tiktok.com/@testuser/video/123' },
        { userEmail: 'test@example.com', date: '2024-07-22', platform: 'youtube', service: 'مشتركين', quantity: 1000, cost: 25.00, status: 'In Progress', link: 'https://youtube.com/channel/test' },
    ];
    const ordersWithIds = MOCK_ORDERS.map((order, index) => ({...order, id: `ORD_MOCK_${index}`}));
    setToStorage(DB_ORDERS_KEY, ordersWithIds);
  }
  
  initPricesDB();
  initPaymentSettingsDB();
  
  // Init fund requests
  const fundRequests = getFromStorage<FundTransferRequest[]>(DB_FUND_REQUESTS_KEY, []);
    if (fundRequests.length === 0) {
        setToStorage(DB_FUND_REQUESTS_KEY, []);
    }
    
    // Init messages
  const messages = getFromStorage<Message[]>(DB_MESSAGES_KEY, []);
    if (messages.length === 0) {
        setToStorage(DB_MESSAGES_KEY, []);
    }
};


// --- Price Management ---
export const getPlatformsData = (): Record<string, Platform> => {
    const storedPlatforms = getFromStorage<Record<string, Omit<Platform, 'icon'>>>(DB_PRICES_KEY, {});
    // Re-attach the JSX icons from the default constants
    const hydratedPlatforms = Object.fromEntries(
        Object.entries(storedPlatforms).map(([key, platform]) => {
            return [key, { ...platform, icon: DEFAULT_PLATFORMS[key]?.icon || null }];
        })
    );
    return hydratedPlatforms;
}

export const updateServicePrice = (platformId: string, serviceId: string, newPricePer1000: number): boolean => {
    const platforms = getFromStorage<Record<string, Omit<Platform, 'icon'>>>(DB_PRICES_KEY, {});
    if (platforms[platformId] && platforms[platformId].services[serviceId]) {
        platforms[platformId].services[serviceId].pricePer1000 = newPricePer1000;
        setToStorage(DB_PRICES_KEY, platforms);
        return true;
    }
    return false;
}

// --- Payment Settings Management ---
export const getPaymentSettings = (): PaymentSettings => {
    return getFromStorage<PaymentSettings>(DB_PAYMENT_SETTINGS_KEY, DEFAULT_PAYMENT_SETTINGS);
}

export const updatePaymentSettings = (newSettings: PaymentSettings): boolean => {
    setToStorage(DB_PAYMENT_SETTINGS_KEY, newSettings);
    return true;
}


// --- User Management ---
export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string; user?: AppUser } => {
  const users = getFromStorage<User[]>(DB_USERS_KEY, []);
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل.' };
  }

  const newUser: User = { name, email: email.toLowerCase(), passwordHash: password, balance: 0, profilePicture: undefined };
  users.push(newUser);
  setToStorage(DB_USERS_KEY, users);
  const { passwordHash, ...userForApp } = newUser;
  return { success: true, message: 'تم إنشاء الحساب بنجاح!', user: userForApp };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: AppUser } => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    }
    
    // WARNING: In a real application, compare password hashes, not plaintext.
    if (user.passwordHash !== password) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    }

    // Set session
    const { passwordHash, ...userForSession } = user;
    setToStorage(DB_SESSION_KEY, userForSession);
    return { success: true, message: 'تم تسجيل الدخول بنجاح.', user: userForSession };
};

export const logoutUser = (): void => {
    window.localStorage.removeItem(DB_SESSION_KEY);
};

export const getCurrentUser = (): AppUser | null => {
    return getFromStorage<AppUser | null>(DB_SESSION_KEY, null);
};

export const requestPasswordReset = (email: string): { success: boolean, message: string } => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    // In a real app, you would generate a token, save it with an expiry date, and email a link.
    // Here, we just log it to the console for simulation.
    // We always return success to prevent user enumeration attacks.
    if (userExists) {
        console.log(`[SIMULATION] Password reset link would be sent to: ${email}`);
    } else {
        console.log(`[SIMULATION] Password reset requested for non-existent email: ${email}`);
    }
    
    return { success: true, message: "If an account with this email exists, a password reset link has been sent." };
}

export const updateUserBalance = (email: string, newBalance: number): boolean => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        return false;
    }

    users[userIndex].balance = newBalance;
    setToStorage(DB_USERS_KEY, users);
    
    // Also update session if the updated user is the current user
    const currentUserInSession = getCurrentUser();
    if (currentUserInSession && currentUserInSession.email.toLowerCase() === email.toLowerCase()) {
        const { passwordHash, ...userForSession } = users[userIndex];
        setToStorage(DB_SESSION_KEY, userForSession);
    }

    return true;
};

// --- Account Settings ---
const updateAndRefreshSession = (email: string, updates: Partial<User>): AppUser | null => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) return null;

    // Apply updates to the user object
    users[userIndex] = { ...users[userIndex], ...updates };
    setToStorage(DB_USERS_KEY, users);

    // Update session if it's the current user
    const currentUserInSession = getCurrentUser();
    if (currentUserInSession && currentUserInSession.email.toLowerCase() === email.toLowerCase()) {
        const { passwordHash, ...userForSession } = users[userIndex];
        setToStorage(DB_SESSION_KEY, userForSession);
        return userForSession;
    }

    const { passwordHash, ...publicUser } = users[userIndex];
    return publicUser;
};

export const updateUserName = (email: string, newName: string): { success: boolean; user?: AppUser } => {
    const updatedUser = updateAndRefreshSession(email, { name: newName });
    return { success: !!updatedUser, user: updatedUser || undefined };
};

export const updateUserEmail = (currentEmail: string, newEmail: string, password: string): { success: boolean; message: string; user?: AppUser } => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === currentEmail.toLowerCase());

    if (userIndex === -1) {
        return { success: false, message: "المستخدم غير موجود." };
    }

    const user = users[userIndex];
    // WARNING: In a real application, compare password hashes.
    if (user.passwordHash !== password) {
        return { success: false, message: "كلمة المرور غير صحيحة." };
    }

    const newEmailLower = newEmail.toLowerCase();
    const isNewEmailTaken = users.some((u, i) => i !== userIndex && u.email.toLowerCase() === newEmailLower);
    if (isNewEmailTaken) {
        return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل." };
    }

    // Update user's email
    users[userIndex].email = newEmailLower;
    setToStorage(DB_USERS_KEY, users);
    
    // Update email in orders
    const orders = getFromStorage<Order[]>(DB_ORDERS_KEY, []);
    const updatedOrders = orders.map(order => {
        if (order.userEmail.toLowerCase() === currentEmail.toLowerCase()) {
            return { ...order, userEmail: newEmailLower };
        }
        return order;
    });
    setToStorage(DB_ORDERS_KEY, updatedOrders);

    // Update email in fund requests
    const fundRequests = getFromStorage<FundTransferRequest[]>(DB_FUND_REQUESTS_KEY, []);
    const updatedFundRequests = fundRequests.map(req => {
        if (req.userEmail.toLowerCase() === currentEmail.toLowerCase()) {
            return { ...req, userEmail: newEmailLower };
        }
        return req;
    });
    setToStorage(DB_FUND_REQUESTS_KEY, updatedFundRequests);

    // Update session
    const { passwordHash, ...userForSession } = users[userIndex];
    setToStorage(DB_SESSION_KEY, userForSession);

    return { success: true, message: "تم تحديث البريد الإلكتروني بنجاح.", user: userForSession };
};


export const updateUserPassword = (email: string, currentPassword: string, newPassword: string): { success: boolean; message: string } => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: "المستخدم غير موجود." };
    if (user.passwordHash !== currentPassword) return { success: false, message: "كلمة المرور الحالية غير صحيحة." };

    updateAndRefreshSession(email, { passwordHash: newPassword });
    return { success: true, message: "تم تحديث كلمة المرور بنجاح." };
};

export const updateUserProfilePicture = (email: string, pictureDataUrl: string): { success: boolean; user?: AppUser } => {
    const updatedUser = updateAndRefreshSession(email, { profilePicture: pictureDataUrl });
    return { success: !!updatedUser, user: updatedUser || undefined };
};

// --- Order Management ---
export const getOrdersForUser = (userEmail: string): Order[] => {
    const allOrders = getFromStorage<Order[]>(DB_ORDERS_KEY, []);
    return allOrders.filter(order => order.userEmail.toLowerCase() === userEmail.toLowerCase()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addOrderForUser = (userEmail: string, orderDetails: OrderDetails): Order => {
    const allOrders = getFromStorage<Order[]>(DB_ORDERS_KEY, []);
    const platforms = getPlatformsData();
    
    // Find platform ID from platform name
    let platformId = Object.keys(platforms).find(pId => platforms[pId].name === orderDetails.platform);
    if (!platformId) {
        // Handle special cases like "add funds" which don't have a platform entry
        if (orderDetails.service === 'إضافة رصيد') {
            platformId = 'internal_fund_transfer'; // Use a specific, non-conflicting key
        } else {
            platformId = 'unknown';
        }
    }

    const newOrder: Order = {
        id: `ORD${Date.now()}`,
        userEmail: userEmail.toLowerCase(),
        date: new Date().toISOString().split('T')[0],
        platform: platformId,
        service: orderDetails.service,
        quantity: orderDetails.quantity,
        cost: orderDetails.cost,
        link: orderDetails.link,
        status: 'Pending', // New orders start as pending
    };

    allOrders.push(newOrder);
    setToStorage(DB_ORDERS_KEY, allOrders);
    
    // Dispatch notification for admin
    notificationService.dispatch('newNotification', { 
        message: `طلب جديد من ${userEmail} بقيمة ${newOrder.cost.toFixed(2)}$`, 
        type: 'success' 
    });

    return newOrder;
};

// --- Admin Functions ---

export const getAllUsers = (): AppUser[] => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    return users.map(({ passwordHash, ...user }) => user);
};

export const getAllOrders = (): Order[] => {
    return getFromStorage<Order[]>(DB_ORDERS_KEY, []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const updateOrderStatus = (orderId: string, newStatus: Order['status']): boolean => {
    const orders = getFromStorage<Order[]>(DB_ORDERS_KEY, []);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return false;

    orders[orderIndex].status = newStatus;
    setToStorage(DB_ORDERS_KEY, orders);

    // Dispatch notification for admin
    const statusText = {
        Completed: "مكتمل",
        'In Progress': "قيد التنفيذ",
        Pending: "قيد الانتظار",
    };
    notificationService.dispatch('newNotification', { 
        message: `تم تحديث الطلب #${orderId.slice(-6)} إلى "${statusText[newStatus]}"`,
        type: 'info' 
    });
    
    return true;
};

export const deleteUser = (email: string): boolean => {
    let users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const initialLength = users.length;
    users = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());

    if (users.length < initialLength) {
        setToStorage(DB_USERS_KEY, users);
        // Note: Orders for this user are not deleted for historical/analytical purposes.
        // In a real app, you might anonymize them or handle them differently.
        return true;
    }
    return false;
};

export const updateUserNameByAdmin = (email: string, newName: string): boolean => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) return false;

    users[userIndex].name = newName;
    setToStorage(DB_USERS_KEY, users);
    
    const currentUserInSession = getCurrentUser();
    if (currentUserInSession && currentUserInSession.email.toLowerCase() === email.toLowerCase()) {
        const { passwordHash, ...userForSession } = users[userIndex];
        setToStorage(DB_SESSION_KEY, userForSession);
    }
    return true;
};

export const updateUserEmailByAdmin = (currentEmail: string, newEmail: string): { success: boolean; message: string; } => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === currentEmail.toLowerCase());

    if (userIndex === -1) {
        return { success: false, message: "المستخدم غير موجود." };
    }

    const newEmailLower = newEmail.toLowerCase();
    if (currentEmail.toLowerCase() === newEmailLower) {
         return { success: false, message: "البريد الإلكتروني الجديد مطابق للحالي." };
    }

    const isNewEmailTaken = users.some((u, i) => i !== userIndex && u.email.toLowerCase() === newEmailLower);
    if (isNewEmailTaken) {
        return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل." };
    }

    users[userIndex].email = newEmailLower;
    setToStorage(DB_USERS_KEY, users);

    const updateEmailInCollection = <T extends { userEmail: string }>(key: string): void => {
        const items = getFromStorage<T[]>(key, []);
        const updatedItems = items.map(item => {
            if (item.userEmail.toLowerCase() === currentEmail.toLowerCase()) {
                return { ...item, userEmail: newEmailLower };
            }
            return item;
        });
        setToStorage(key, updatedItems);
    };

    updateEmailInCollection<Order>(DB_ORDERS_KEY);
    updateEmailInCollection<FundTransferRequest>(DB_FUND_REQUESTS_KEY);
    updateEmailInCollection<Message>(DB_MESSAGES_KEY);

    const currentUserInSession = getCurrentUser();
    if (currentUserInSession && currentUserInSession.email.toLowerCase() === currentEmail.toLowerCase()) {
        const { passwordHash, ...userForSession } = users[userIndex];
        setToStorage(DB_SESSION_KEY, userForSession);
    }

    return { success: true, message: "تم تحديث البريد الإلكتروني بنجاح." };
};

export const updateUserPasswordByAdmin = (email: string, newPassword: string): boolean => {
    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
        return false; // User not found
    }
    
    users[userIndex].passwordHash = newPassword;
    setToStorage(DB_USERS_KEY, users);
    
    // In a real app, you might want to invalidate the user's session here.
    // For this app, we'll just update the password.
    
    return true;
};


// --- Fund Transfer Request Management ---
export const addFundTransferRequest = (userEmail: string, amount: number, bank: Bank, screenshotDataUrl: string): FundTransferRequest => {
    const requests = getFromStorage<FundTransferRequest[]>(DB_FUND_REQUESTS_KEY, []);
    const newRequest: FundTransferRequest = {
        id: `FTR${Date.now()}`,
        userEmail,
        amount,
        bankId: bank.id,
        bankName: bank.name,
        screenshotDataUrl,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
    };
    requests.push(newRequest);
    setToStorage(DB_FUND_REQUESTS_KEY, requests);
    notificationService.dispatch('newNotification', { 
        message: `طلب شحن رصيد جديد من ${userEmail}`, 
        type: 'info' 
    });
    return newRequest;
};

export const getFundTransferRequests = (): FundTransferRequest[] => {
    return getFromStorage<FundTransferRequest[]>(DB_FUND_REQUESTS_KEY, []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFundRequestsForUser = (userEmail: string): FundTransferRequest[] => {
    const allRequests = getFromStorage<FundTransferRequest[]>(DB_FUND_REQUESTS_KEY, []);
    return allRequests
        .filter(req => req.userEmail.toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const updateFundTransferRequestStatus = (requestId: string, status: 'Approved' | 'Rejected'): boolean => {
    const requests = getFundTransferRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1 || requests[requestIndex].status !== 'Pending') {
        return false;
    }
    requests[requestIndex].status = status;
    setToStorage(DB_FUND_REQUESTS_KEY, requests);
    return true;
};

export const approveFundTransferRequest = (requestId: string): boolean => {
    const requests = getFundTransferRequests();
    const request = requests.find(r => r.id === requestId);
    if (!request || request.status !== 'Pending') return false;

    const users = getFromStorage<User[]>(DB_USERS_KEY, []);
    const user = users.find(u => u.email.toLowerCase() === request.userEmail.toLowerCase());
    if (!user) return false;

    const newBalance = user.balance + request.amount;
    const balanceUpdated = updateUserBalance(request.userEmail, newBalance);

    if (balanceUpdated) {
        return updateFundTransferRequestStatus(requestId, 'Approved');
    }
    return false;
};

export const rejectFundTransferRequest = (requestId: string): boolean => {
    return updateFundTransferRequestStatus(requestId, 'Rejected');
};

// --- Messaging System ---
export const sendMessageToUser = (userEmail: string, message: string): void => {
    const messages = getFromStorage<Message[]>(DB_MESSAGES_KEY, []);
    const newMessage: Message = {
        id: `MSG_${Date.now()}`,
        userEmail: userEmail.toLowerCase(),
        from: 'Admin',
        message,
        date: new Date().toISOString(),
        read: false,
    };
    messages.push(newMessage);
    setToStorage(DB_MESSAGES_KEY, messages);
    notificationService.dispatch('newNotification', { 
        message: `تم إرسال رسالة إلى ${userEmail}`, 
        type: 'info' 
    });
};

export const getMessagesForUser = (userEmail: string): Message[] => {
    const allMessages = getFromStorage<Message[]>(DB_MESSAGES_KEY, []);
    return allMessages
        .filter(msg => msg.userEmail.toLowerCase() === userEmail.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const markMessagesAsReadForUser = (userEmail: string): void => {
    const allMessages = getFromStorage<Message[]>(DB_MESSAGES_KEY, []);
    let changed = false;
    const updatedMessages = allMessages.map(msg => {
        if (msg.userEmail.toLowerCase() === userEmail.toLowerCase() && !msg.read) {
            changed = true;
            return { ...msg, read: true };
        }
        return msg;
    });
    if (changed) {
        setToStorage(DB_MESSAGES_KEY, updatedMessages);
    }
};