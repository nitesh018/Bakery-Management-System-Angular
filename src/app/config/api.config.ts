import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl, // '' in dev (proxy), full in prod
  endpoints: {
    userLogin: '/user/login',
    adminLogin: '/admin/login',
    userSignup: '/user/register',
    productsAdmin: '/admin/item',
    addProduct: '/admin/item/add',
    updateProduct: '/admin/item/update',
    deleteProductByName: '/admin/item/delete-by-name',
    salesReport: '/admin/reports',
    updateOrderStatus: '/admin/order/updatestatus',
    userProducts: '/user/items',
    userOrder: '/user/order',
    userOrders: '/user/orders',
    cartAdd: '/user/cart/add',
    cart: '/user/cart',
    cartView: '/user/cart/view', // added for view cart
    cartCheckout: '/user/cart/checkout',
    cartUpdate: '/user/cart/update'
  }
};