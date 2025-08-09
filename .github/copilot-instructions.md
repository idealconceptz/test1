<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Next.js 15 TypeScript Project

This is a Next.js 15 TypeScript application with the App Router. When working in this project:

## Framework & Technology Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 18** for UI components
- **Tailwind CSS** for styling
- **ESLint** for code linting

## Development Guidelines

- Use TypeScript for all new files
- Follow Next.js 15 App Router conventions
- Place React components in the `src/app` directory
- Use server components by default, add 'use client' directive only when necessary
- Prefer function components over class components
- Use TypeScript interfaces for props and data structures
- Follow Next.js file-based routing conventions

## Code Standards

- Use meaningful component and variable names
- Add TypeScript types for all props and function parameters
- Use Next.js built-in components (Image, Link, etc.) when applicable
- Implement proper error handling and loading states
- Follow React best practices for hooks and state management

## Project Structure

- `src/app/` - App Router pages and layouts
- `src/app/globals.css` - Global styles
- `src/app/layout.tsx` - Root layout component
- `src/app/page.tsx` - Home page component

## Performance Considerations

- Use Next.js Image component for optimized images
- Implement proper metadata for SEO
- Consider server vs client components for optimal performance
- Use dynamic imports for code splitting when needed
