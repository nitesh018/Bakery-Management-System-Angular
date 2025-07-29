export const API_CONFIG = {
  baseUrl: 'http://172.30.252.34:8080', // Backend URL provided by your developer
  endpoints: {
    userLogin: '/user/login',
    adminLogin: '/admin/login', // Using same endpoint, will differentiate by user type
    userSignup: '/user/register',
    forgotPassword: '/api/forgot-password' // Keep this for future implementation
  }
};
