import {
    getUserByApiKey,
    getPlatformsData,
    addOrderForUser,
    getOrdersForUser,
    getAllOrders,
    updateUserBalance,
} from './databaseService';
import type { OrderDetails, Order, User } from '../types';

interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

// --- API Authentication ---
const authenticate = (apiKey: string): { success: boolean; user?: User; message?: string } => {
    const user = getUserByApiKey(apiKey);
    if (!user) {
        return { success: false, message: 'Authentication failed: Invalid API Key.' };
    }
    return { success: true, user };
};

// --- Public API Endpoints (Simulated) ---

/**
 * @api {get} /api/services Get available services
 * @apiName GetServices
 * @apiGroup API
 *
 * @apiHeader {String} X-API-Key User's unique API key.
 *
 * @apiSuccess {Object} data Object containing all platforms and their services.
 */
export const getServices = (apiKey: string): ApiResponse => {
    const authResult = authenticate(apiKey);
    if (!authResult.success) {
        return { success: false, message: authResult.message! };
    }

    const platforms = getPlatformsData();
    // Strip icon data for API response
    const apiPlatforms = Object.fromEntries(
        Object.entries(platforms).map(([key, platform]) => {
            const { icon, ...rest } = platform;
            return [key, rest];
        })
    );

    return {
        success: true,
        message: 'Services retrieved successfully.',
        data: apiPlatforms
    };
};

/**
 * @api {post} /api/orders Create a new order
 * @apiName CreateOrder
 * @apiGroup API
 *
 * @apiHeader {String} X-API-Key User's unique API key.
 * 
 * @apiBody {String} platformId ID of the platform (e.g., "instagram").
 * @apiBody {String} serviceId ID of the service (e.g., "followers").
 * @apiBody {Number} quantity The desired quantity.
 * @apiBody {String} link The target link for the service.
 *
 * @apiSuccess {Object} data The newly created order object.
 */
export const createOrder = (apiKey: string, orderData: { platformId: string; serviceId: string; quantity: number; link: string }): ApiResponse => {
    const authResult = authenticate(apiKey);
    if (!authResult.success || !authResult.user) {
        return { success: false, message: authResult.message! };
    }
    
    const { user } = authResult;
    const { platformId, serviceId, quantity, link } = orderData;

    const platforms = getPlatformsData();
    const platform = platforms[platformId];
    if (!platform) {
        return { success: false, message: 'Invalid platform ID.' };
    }
    
    const service = platform.services[serviceId];
    if (!service) {
        return { success: false, message: 'Invalid service ID for the selected platform.' };
    }

    if (quantity < service.min || quantity > service.max) {
        return { success: false, message: `Quantity must be between ${service.min} and ${service.max}.` };
    }
    
    const cost = (quantity / 1000) * service.pricePer1000;
    
    if (user.balance < cost) {
        return { success: false, message: 'Insufficient balance to place this order.' };
    }

    const orderDetails: OrderDetails = {
        platform: platform.name,
        service: service.name,
        quantity,
        cost,
        link,
        paymentMethod: 'balance' // API orders always use balance
    };

    const newOrder = addOrderForUser(user.email, orderDetails);

    // Deduct from balance
    const newBalance = user.balance - cost;
    updateUserBalance(user.email, newBalance);

    return {
        success: true,
        message: 'Order placed successfully.',
        data: newOrder
    };
};

/**
 * @api {get} /api/orders/:id Get order status
 * @apiName GetOrder
 * @apiGroup API
 *
 * @apiHeader {String} X-API-Key User's unique API key.
 * @apiParam {String} id The Order ID.
 *
 * @apiSuccess {Object} data The order object.
 */
export const getOrderStatus = (apiKey: string, orderId: string): ApiResponse => {
    const authResult = authenticate(apiKey);
    if (!authResult.success || !authResult.user) {
        return { success: false, message: authResult.message! };
    }
    
    const { user } = authResult;
    
    const allOrders = getAllOrders(); 
    const order = allOrders.find(o => o.id === orderId);

    if (!order) {
        return { success: false, message: 'Order not found.' };
    }
    
    if (order.userEmail.toLowerCase() !== user.email.toLowerCase()) {
         return { success: false, message: 'Access denied. You do not own this order.' };
    }

    return {
        success: true,
        message: 'Order status retrieved successfully.',
        data: order
    };
};
