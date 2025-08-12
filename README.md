<<<<<<< HEAD
# Bakery Management System

A web-based application for managing bakery operations, built with Angular 20. This system provides two separate interfaces - one for bakery administrators to manage products and orders, and another for customers to browse and purchase items.

## Features

### Admin Dashboard
- **Product Management**
  - Add new bakery products with pricing and inventory
  - Update existing product information
  - Delete products from inventory
  - View all products in a comprehensive list
- **Order Management**
  - Update order status (pending, processing, completed, cancelled)
  - Track order history and details
- **Sales Analytics**
  - Generate detailed sales reports
  - View revenue analytics and trends
- **User Management**
  - Admin authentication and authorization
  - Secure admin-only access controls

### Customer Dashboard
- **Product Browsing**
  - Browse available bakery products with descriptions and pricing
  - Search and filter through the product catalog
  - Check real-time inventory availability
- **Shopping Cart**
  - Add products to cart with custom quantities
  - Modify cart contents and update quantities
  - Remove unwanted items
  - View total cost and order summary
- **Order Management**
  - Place orders directly from the shopping cart
  - Receive order confirmations
  - Track order status and history
- **User Account**
  - Create new customer accounts
  - Secure login and session management

## Technology Stack

- **Frontend**: Angular 20 with TypeScript
- **UI/UX**: Custom CSS with responsive design
- **State Management**: RxJS for reactive programming
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with guards
- **Forms**: Reactive Forms with validation
- **Authentication**: JWT-based authentication system
- **Development Server**: Angular CLI with proxy configuration

## Project Structure

```
src/
├── app/
│   ├── admin-dashboard/           # Admin interface
│   │   └── components/           # Admin components
│   │       ├── add-product/      # Product creation
│   │       ├── update-product/   # Product editing
│   │       ├── delete-product/   # Product removal
│   │       ├── view-products/    # Product listing
│   │       ├── sales-report/     # Analytics
│   │       └── update-order-status/ # Order management
│   ├── user-dashboard/           # Customer interface
│   │   └── components/           # User components
│   │       ├── navbar/           # Navigation
│   │       ├── product-grid/     # Product display
│   │       └── shopping-cart/    # Cart functionality
│   ├── services/                 # Business logic
│   │   ├── auth.service.ts       # Authentication
│   │   ├── product.service.ts    # Product operations
│   │   ├── cart.service.ts       # Cart management
│   │   └── notification.service.ts # User notifications
│   ├── guards/                   # Route protection
│   │   ├── auth.guard.ts         # User authentication
│   │   └── admin.guard.ts        # Admin authorization
│   ├── interceptors/             # HTTP interceptors
│   │   ├── auth.interceptor.ts   # JWT token handling
│   │   ├── error.interceptor.ts  # Error handling
│   │   └── loading.interceptor.ts # Loading states
│   └── models/                   # Data interfaces
│       ├── order.model.ts        # Order structure
│       ├── cart.model.ts         # Cart structure
│       └── sales-report.model.ts # Analytics structure
```

## Getting Started

### What You Need
- Node.js (v18 or higher)
- npm or yarn package manager
- Backend API server running on port 8080

### How to Set Up

1. **Download the project**
   ```bash
   git clone https://github.com/your-username/bakery-management-system.git
   cd bakery-management-system
   ```

2. **Install required packages**
   ```bash
   npm install
   ```

3. **Set up the environment**
   - Make sure your backend server is running on port 8080
   - Update API settings in `src/environments/environment.ts` if needed

4. **Start the application**
   ```bash
   npm start
   ```
   Open your browser and go to `http://localhost:4200`

### Available Commands

```bash
# Start the development server
npm start

# Build for production
npm run build

# Run with automatic rebuilding
npm run watch
```

## Security and Authentication

### User Access Levels
- **Admin Users**: Can manage all products, view sales reports, and update order statuses
- **Regular Customers**: Can browse products, manage their cart, and place orders

### Security Features
- JWT-based authentication
- Role-based access control
- Route guards for protected pages
- HTTP interceptors for token management
- Session management with automatic logout

## How It Connects to the Backend

This application talks to a backend server through a REST API. Here's how it works:
- **Development Setup**: Uses Angular's proxy to forward API calls to your backend
- **Automatic Error Handling**: Built-in interceptors manage authentication tokens and errors
- **Organized Services**: All API communication goes through dedicated service classes

### API Routes
- `/admin/*` - Admin operations (products, orders, reports)
- `/user/*` - User operations (authentication, cart, orders)

## Mobile and Desktop Support

The application works well on both desktop computers and mobile devices. It automatically adjusts the layout based on screen size and works across different web browsers.

## Configuration Details

### Proxy Setup
During development, the app uses this configuration to connect to your backend:
```json
{
  "/admin/": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  },
  "/user/": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Key Features Explained

### Product Management
- Create, read, update, and delete bakery items
- Upload and manage product images
- Track inventory levels
- Set and update pricing

### Order Processing
- Update order status in real-time
- View complete order history
- Send notifications to customers
- Ready for payment system integration

### Sales Analytics
- Track sales performance over time
- Monitor revenue trends
- Analyze which products are most popular
- Generate reports for specific date ranges

## Contributing to This Project

If you'd like to contribute improvements or fixes:

1. Fork this repository to your GitHub account
2. Create a new branch for your feature (`git checkout -b feature/your-feature-name`)
3. Make your changes and commit them (`git commit -m 'Add your feature description'`)
4. Push your changes (`git push origin feature/your-feature-name`)
5. Create a Pull Request on GitHub

## License

This project uses the ISC License.

## Getting Help

If you run into issues or have questions about the project, please create an issue on the GitHub repository and I'll help you out.

---

This bakery management system was built to help bakery owners manage their business more efficiently while providing customers with a smooth online shopping experience.
=======
# Bakery-Management-System-Angular
>>>>>>> 29b6b64759c9c01a75fe125fb6fb5d752e514959
