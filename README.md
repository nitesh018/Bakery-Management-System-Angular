# Library Management System

An Angular-based frontend application for managing library operations, featuring a modern and responsive user interface.

## Features

### Current Implementation
- **Login Component**: Complete login page with modern UI design
  - Responsive navbar with "Library Management System" branding
  - Centered login form with User ID and Password fields
  - Two-way data binding using Angular's `[(ngModel)]`
  - Form validation for required fields
  - "Forgot Password / Create ID" link
  - Mock API integration using `fetch` for backend connection

### Technical Stack
- **Framework**: Angular 20+ with TypeScript
- **Styling**: Plain CSS with responsive design (no external frameworks)
- **Forms**: Angular Forms with template-driven approach
- **HTTP**: Native fetch API for backend communication
- **Architecture**: Component-based with modular structure

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (Node Package Manager)
- Angular CLI

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
To start a local development server, run:
```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Project Structure
```
src/
├── app/
│   ├── login/           # Login component
│   │   ├── login.ts     # Component logic with API integration
│   │   ├── login.html   # Template with form and validation
│   │   └── login.css    # Responsive styling
│   ├── app.ts           # Root component
│   └── app.config.ts    # App configuration
├── styles.css           # Global styles
└── index.html          # Main HTML file
```

## API Integration

### Login Endpoint
The application is configured to make API calls to `/api/login` with the following structure:

**Request:**
```javascript
POST /api/login
Content-Type: application/json

{
  "userId": "string",
  "password": "string"
}
```

**Expected Response:**
```javascript
// Success
{
  "success": true,
  "user": { ... },
  "token": "jwt_token_here"
}

// Error
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Development Guidelines

### Code Scaffolding
Angular CLI includes powerful code scaffolding tools. To generate a new component, run:
```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:
```bash
ng generate --help
```

### Building
To build the project run:
```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running Tests
To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:
```bash
ng test
```

## Future Development

### Planned Features
- Dashboard component after successful login
- Book management system (add, edit, delete, search)
- User management for librarians
- Book checkout/return functionality
- Reports and analytics
- User profile management
- Advanced search and filtering

### Backend Integration
- Connect the mock API calls to actual backend endpoints
- Implement proper authentication and authorization
- Add error handling and user feedback
- Implement session management

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
