import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OrderForm from './components/OrderForm';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import IdeaGenerator from './components/IdeaGenerator';
import Services from './components/Services';
import Payment from './components/Payment';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import WhatsAppButton from './components/WhatsAppButton';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutUs from './components/AboutUs';
import AddFunds from './components/AddFunds';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';
import PriceManagement from './components/PriceManagement';
import PaymentManagement from './components/PaymentManagement';
import FundRequestManagement from './components/FundRequestManagement';
import NotificationContainer from './components/NotificationContainer';
import ApiDocs from './components/ApiDocs';
import { notificationService } from './services/notificationService';
import { 
    initDB, 
    getCurrentUser, 
    logoutUser, 
    getOrdersForUser, 
    addOrderForUser, 
    updateUserBalance,
    getAllUsers,
    getAllOrders,
    updateOrderStatus,
    deleteUser,
    updateUserName,
    updateUserPassword,
    updateUserProfilePicture,
    updateUserEmail,
    getPlatformsData,
    updateServicePrice,
    getPaymentSettings,
    updatePaymentSettings,
    getFundTransferRequests,
    approveFundTransferRequest,
    rejectFundTransferRequest,
    getFundRequestsForUser,
    updateUserNameByAdmin,
    updateUserEmailByAdmin,
    updateUserPasswordByAdmin,
    sendMessageToUser,
    getMessagesForUser,
    markMessagesAsReadForUser,
    regenerateApiKey,
} from './services/databaseService';
// FIX: Import View and User from the centralized types file and remove local definitions.
import type { OrderDetails, Order, View, User, Platform, Notification, PaymentSettings, FundTransferRequest, Message } from './types';

const ADMIN_EMAIL = 'admin@example.com';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userFundRequests, setUserFundRequests] = useState<FundTransferRequest[]>([]);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [platformsData, setPlatformsData] = useState<Record<string, Platform>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  
  // Admin state
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [fundRequests, setFundRequests] = useState<FundTransferRequest[]>([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  
  const isAdmin = useMemo(() => currentUser?.email === ADMIN_EMAIL, [currentUser]);

  // Check session on initial load
  useEffect(() => {
    initDB();
    setPlatformsData(getPlatformsData());
    setPaymentSettings(getPaymentSettings());
    const user = getCurrentUser();
    if (user) {
        setCurrentUser(user);
        setUserOrders(getOrdersForUser(user.email));
        setUserFundRequests(getFundRequestsForUser(user.email));
        setUserMessages(getMessagesForUser(user.email));
    }
  }, []);
  
  // Fetch admin data if user is admin
  useEffect(() => {
    if(isAdmin) {
        setAllUsers(getAllUsers());
        setAllOrders(getAllOrders());
        setFundRequests(getFundTransferRequests());
    }
  }, [isAdmin]);

  // Scroll to top on view change and refresh dashboard data
  useEffect(() => {
    window.scrollTo(0, 0);
    // Re-fetch data when navigating back to the dashboard to see updates.
    if (view === 'dashboard' && currentUser) {
        setUserOrders(getOrdersForUser(currentUser.email));
        setUserFundRequests(getFundRequestsForUser(currentUser.email));
        setUserMessages(getMessagesForUser(currentUser.email));
    }
  }, [view, currentUser]);
  
  // Notification listener effect
  useEffect(() => {
    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const addNotification = (message: string, type: Notification['type']) => {
        const newNotification: Notification = {
            id: Date.now(),
            message,
            type,
        };
        setNotifications(prev => [newNotification, ...prev]);
    
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, 5000); // 5 seconds
    };
    
    const handleNewNotification = (data: { message: string; type: Notification['type'] }) => {
        if (isAdmin) {
            addNotification(data.message, data.type);
        }
    };

    const unsubscribe = notificationService.subscribe('newNotification', handleNewNotification);

    return () => {
        unsubscribe();
    };
  }, [isAdmin]);


  const isAuthenticated = !!currentUser;
  
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleStartPayment = (details: OrderDetails) => {
    if (!isAuthenticated) {
        openAuthModal('login');
        return;
    }
    setCurrentOrder(details);
    setView('payment');
  };

  const handleStartAddFunds = (amount: number, paymentMethod: string) => {
    if (!isAuthenticated || !currentUser) {
        openAuthModal('login');
        return;
    }
    const addFundsDetails: OrderDetails = {
      platform: 'رصيد الحساب',
      service: 'إضافة رصيد',
      quantity: amount,
      cost: amount,
      link: `user:${currentUser.email}`,
      paymentMethod: paymentMethod,
    };
    setCurrentOrder(addFundsDetails);
    setView('payment');
  };
  
  const handlePaymentComplete = (details: OrderDetails) => {
      if (!currentUser) return;

      // This function now primarily handles orders paid by balance or other direct methods.
      // Bank transfers for adding funds are handled separately and create a FundTransferRequest, not an order.
      const newOrder = addOrderForUser(currentUser.email, details);

      // This logic is for direct payments (e.g., balance)
      if (details.service === 'إضافة رصيد' && details.paymentMethod !== 'bank_transfer') {
          const newBalance = currentUser.balance + details.cost;
          updateUserBalance(currentUser.email, newBalance);
          setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: newBalance } : null);
          updateOrderStatus(newOrder.id, 'Completed');
      } else if (details.service !== 'إضافة رصيد' && details.paymentMethod === 'balance') {
          const newBalance = currentUser.balance - details.cost;
          updateUserBalance(currentUser.email, newBalance);
          setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: newBalance } : null);
      }

      // Refresh order lists
      setUserOrders(getOrdersForUser(currentUser.email));
      if (isAdmin) {
          setAllOrders(getAllOrders());
      }
  };
  
  const openAuthModal = (initialView: 'login' | 'signup') => {
    setAuthModalView(initialView);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setUserOrders(getOrdersForUser(user.email));
    setUserFundRequests(getFundRequestsForUser(user.email));
    setUserMessages(getMessagesForUser(user.email));
    closeAuthModal();
    if(user.email === ADMIN_EMAIL) {
        setView('admin');
    } else {
        setView('dashboard');
    }
  };
  
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserOrders([]);
    setUserFundRequests([]);
    setUserMessages([]);
    setAllUsers([]);
    setAllOrders([]);
    setFundRequests([]);
    setView('home');
  };
  
  // --- Admin Handlers ---
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    if(updateOrderStatus(orderId, status)) {
        setAllOrders(getAllOrders());
        if(currentUser) {
            setUserOrders(getOrdersForUser(currentUser.email));
        }
    }
  };

  const handleDeleteUser = (email: string) => {
    if(deleteUser(email)) {
        setAllUsers(getAllUsers());
    }
  };
  
  const handleUpdateUserBalanceByAdmin = (email: string, newBalance: number) => {
    if(updateUserBalance(email, newBalance)) {
        setAllUsers(getAllUsers());
         if (currentUser && currentUser.email === email) {
            setCurrentUser(prev => prev ? {...prev, balance: newBalance} : null);
        }
    }
  };

  const handleUpdateUserNameByAdmin = (email: string, newName: string) => {
    if(updateUserNameByAdmin(email, newName)) {
        setAllUsers(getAllUsers());
        if (currentUser && currentUser.email === email) {
            setCurrentUser(prev => prev ? {...prev, name: newName} : null);
        }
        alert('تم تحديث اسم المستخدم بنجاح.');
    } else {
        alert('فشل تحديث اسم المستخدم.');
    }
  };

  const handleUpdateUserEmailByAdmin = (currentEmail: string, newEmail: string) => {
    const result = updateUserEmailByAdmin(currentEmail, newEmail);
    if(result.success) {
        setAllUsers(getAllUsers());
        setAllOrders(getAllOrders()); // Orders have userEmail
        setFundRequests(getFundTransferRequests()); // Requests have userEmail
        if (currentUser && currentUser.email === currentEmail) {
            // Log out user or update session to reflect email change
             setCurrentUser(prev => prev ? {...prev, email: newEmail} : null);
        }
    }
    alert(result.message);
  };

  const handleUpdateUserPasswordByAdmin = (email: string, newPassword: string) => {
    if(updateUserPasswordByAdmin(email, newPassword)) {
        alert('تم تحديث كلمة مرور المستخدم بنجاح.');
    } else {
        alert('فشل تحديث كلمة المرور.');
    }
  };

  const handleSendMessageToUser = (email: string, message: string) => {
    sendMessageToUser(email, message);
    alert(`تم إرسال الرسالة إلى ${email}`);
  };
  
   const handleUpdateServicePrice = (platformId: string, serviceId: string, newPrice: number) => {
        if(updateServicePrice(platformId, serviceId, newPrice)) {
            setPlatformsData(getPlatformsData()); // Refresh prices in state
            alert('تم تحديث السعر بنجاح!');
        } else {
            alert('فشل تحديث السعر.');
        }
    };

    const handleUpdatePaymentSettings = (newSettings: PaymentSettings) => {
        if (updatePaymentSettings(newSettings)) {
            setPaymentSettings(newSettings);
            alert('تم تحديث إعدادات الدفع بنجاح!');
        } else {
            alert('فشل تحديث إعدادات الدفع.');
        }
    };

    const handleApproveFundRequest = (requestId: string) => {
        if (approveFundTransferRequest(requestId)) {
            setFundRequests(getFundTransferRequests());
            setAllUsers(getAllUsers()); // Refresh users to show updated balance
            alert('تمت الموافقة على الطلب وتحديث رصيد المستخدم.');
        } else {
            alert('فشلت الموافقة على الطلب.');
        }
    };
    
    const handleRejectFundRequest = (requestId: string) => {
        if (rejectFundTransferRequest(requestId)) {
            setFundRequests(getFundTransferRequests());
             alert('تم رفض الطلب.');
        } else {
            alert('فشل رفض الطلب.');
        }
    };
  
  // --- Settings Handlers ---
  const handleUpdateUserName = (newName: string) => {
    if (currentUser) {
        const result = updateUserName(currentUser.email, newName);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            alert("تم تحديث الاسم بنجاح.");
        }
    }
  };

  const handleUpdateUserPassword = (currentPassword: string, newPassword: string) => {
    if (currentUser) {
        const result = updateUserPassword(currentUser.email, currentPassword, newPassword);
        alert(result.message);
        return result.success;
    }
    return false;
  };

  const handleUpdateUserProfilePicture = (pictureDataUrl: string) => {
     if (currentUser) {
        const result = updateUserProfilePicture(currentUser.email, pictureDataUrl);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            alert("تم تحديث صورة الملف الشخصي بنجاح.");
        }
    }
  };

  const handleUpdateUserEmail = (newEmail: string, password: string): boolean => {
    if (currentUser) {
        const result = updateUserEmail(currentUser.email, newEmail, password);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            alert(result.message);
            return true;
        } else {
            alert(result.message);
            return false;
        }
    }
    return false;
};

    const handleRegenerateApiKey = () => {
        if (currentUser) {
            const result = regenerateApiKey(currentUser.email);
            if (result.success && result.user) {
                setCurrentUser(result.user);
                alert("تم إنشاء مفتاح API جديد بنجاح. تم إبطال مفتاحك القديم.");
            } else {
                alert("فشل إنشاء مفتاح API جديد.");
            }
        }
    };

// --- Message Handlers ---
  const handleMarkMessagesAsRead = () => {
    if (currentUser) {
      markMessagesAsReadForUser(currentUser.email);
      setUserMessages(getMessagesForUser(currentUser.email));
    }
  };


  const analytics = useMemo(() => {
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => {
        if (order.service === 'إضافة رصيد') {
            return sum;
        }
        return sum + order.cost;
    }, 0);
    const followersGained = userOrders.reduce((sum, order) => {
        const serviceName = order.service.toLowerCase();
        if (serviceName.includes('متابعين') || serviceName.includes('مشتركين') || serviceName.includes('followers') || serviceName.includes('subscribers')) {
            return sum + order.quantity;
        }
        return sum;
    }, 0);
    return { totalOrders, totalSpent, followersGained };
  }, [userOrders]);


  const renderContent = () => {
    switch (view) {
      case 'payment':
        return <Payment orderDetails={currentOrder!} setView={setView} onPaymentComplete={handlePaymentComplete} currentUser={currentUser!} paymentSettings={paymentSettings!} />;
      case 'addFunds':
        return isAuthenticated ? <AddFunds onStartPayment={handleStartAddFunds} /> : (
             <>
                <Hero />
                <Services platforms={platformsData} />
                <div id="order" className="py-20 bg-black bg-opacity-20">
                  <OrderForm platforms={platformsData} onStartPayment={handleStartPayment} isAuthenticated={isAuthenticated} currentUser={currentUser} setView={setView} />
                </div>
                <HowItWorks />
                <IdeaGenerator />
                <Testimonials />
              </>
        );
      case 'dashboard':
        return isAuthenticated && currentUser ? <Dashboard user={currentUser} orders={userOrders} fundRequests={userFundRequests} analytics={analytics} setView={setView} platforms={platformsData} messages={userMessages} onMarkMessagesAsRead={handleMarkMessagesAsRead} /> : (
           <>
            <Hero />
            <Services platforms={platformsData} />
            <div id="order" className="py-20 bg-black bg-opacity-20">
              <OrderForm platforms={platformsData} onStartPayment={handleStartPayment} isAuthenticated={isAuthenticated} currentUser={currentUser} setView={setView} />
            </div>
            <HowItWorks />
            <IdeaGenerator />
            <Testimonials />
          </>
        );
      case 'settings':
         return isAuthenticated && currentUser ? (
            <Settings 
                user={currentUser} 
                setView={setView}
                onUpdateName={handleUpdateUserName}
                onUpdatePassword={handleUpdateUserPassword}
                onUpdateProfilePicture={handleUpdateUserProfilePicture}
                onUpdateEmail={handleUpdateUserEmail}
                onRegenerateApiKey={handleRegenerateApiKey}
            />
         ) : <Hero />;
      case 'admin':
        return isAdmin ? (
            <AdminDashboard 
                users={allUsers} 
                orders={allOrders} 
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateUserBalance={handleUpdateUserBalanceByAdmin}
                onDeleteUser={handleDeleteUser}
                onUpdateUserName={handleUpdateUserNameByAdmin}
                onUpdateUserEmail={handleUpdateUserEmailByAdmin}
                onUpdateUserPassword={handleUpdateUserPasswordByAdmin}
                onSendMessage={handleSendMessageToUser}
                platforms={platformsData}
                setView={setView}
            />
        ) : (
            <>
                <Hero />
                <Services platforms={platformsData} />
            </>
        );
      case 'admin/prices':
        return isAdmin ? (
            <PriceManagement
                platforms={platformsData}
                onUpdatePrice={handleUpdateServicePrice}
                setView={setView}
            />
        ) : (
             <>
                <Hero />
                <Services platforms={platformsData} />
            </>
        );
      case 'admin/payments':
        return isAdmin && paymentSettings ? (
            <PaymentManagement
                settings={paymentSettings}
                onUpdateSettings={handleUpdatePaymentSettings}
                setView={setView}
            />
        ) : (
             <>
                <Hero />
                <Services platforms={platformsData} />
            </>
        );
       case 'admin/funds':
        return isAdmin ? (
            <FundRequestManagement
                requests={fundRequests}
                onApprove={handleApproveFundRequest}
                onReject={handleRejectFundRequest}
                setView={setView}
            />
        ) : (
             <>
                <Hero />
                <Services platforms={platformsData} />
            </>
        );
      case 'privacy':
        return <PrivacyPolicy setView={setView} />;
      case 'terms':
        return <TermsOfService setView={setView} />;
      case 'about':
        return <AboutUs setView={setView} />;
      case 'api':
        return <ApiDocs setView={setView} />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <Services platforms={platformsData} />
            <div id="order" className="py-20 bg-black bg-opacity-20">
              <OrderForm platforms={platformsData} onStartPayment={handleStartPayment} isAuthenticated={isAuthenticated} currentUser={currentUser} setView={setView} />
            </div>
            <HowItWorks />
            <IdeaGenerator />
            <Testimonials />
          </>
        );
    }
  };


  return (
    <div className="min-h-screen bg-brand-dark font-sans flex flex-col">
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      <Header 
        setView={setView} 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer setView={setView} />
      <AuthModal 
        isOpen={isAuthModalOpen}
        initialView={authModalView}
        onClose={closeAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
      <WhatsAppButton />
    </div>
  );
};

export default App;
