<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Library Management System - Angular Project

This is an Angular-based Library Management System frontend application focused on providing a clean and responsive user interface.

## Project Context
- Frontend framework: Angular 20+ with TypeScript
- Styling: Plain CSS (no external frameworks like Bootstrap or Tailwind)
- Forms: Angular Forms with two-way data binding using `[(ngModel)]`
- HTTP: Using native `fetch` API for API calls
- Design: Responsive design with modern UI/UX principles

## Current Features
- Login component with user authentication UI
- Responsive navbar displaying "Library Management System"
- Centered login form with User ID and Password fields
- Form validation using Angular forms
- Mock API integration ready for backend connection
- Clean, modern styling with gradients and shadows

## Development Guidelines
- Use TypeScript strict mode
- Follow Angular best practices for component structure
- Maintain responsive design for mobile and desktop
- Use semantic HTML elements for accessibility
- Keep components modular and reusable
- Add proper error handling for API calls
- Use Angular reactive forms or template-driven forms appropriately

## Future Development
- Dashboard component after successful login
- Library book management features
- User management functionality
- Reports and analytics components

## API Integration Notes
- Backend developer should connect to `/api/login` endpoint
- Expects JSON payload with `userId` and `password`
- Returns JSON response for successful/failed authentication
