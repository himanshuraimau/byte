# Documentation

This directory contains documentation for the Byte Mobile App.

## Overview

The Byte Mobile App is a React Native application built with Expo that provides productivity tracking features including TaskSet management, Daily Journal, and Sessions tracking. It integrates with the Next.js API backend (`byte-web`) to provide a unified experience across web and mobile platforms.

## Key Documentation

### Project Structure
- Components are organized by feature (timeline, tasksets, timer, etc.)
- Services handle API integration
- Hooks provide reusable logic
- Constants define theme and configuration

### API Integration
- Uses Next.js API backend from `byte-web`
- Authentication handled via JWT tokens
- All CRUD operations sync with backend

### Design System
- Matches web app theme exactly
- Uses CSS variable equivalents for colors
- GeistMono font (closest match to web's Geist Pixel Square)
- Industrial Minimalist aesthetic

### Feature Parity
- TaskSets: Full CRUD with streak tracking
- Journal: Dedicated pages (not modals)
- Timeline: Unified view of all entries
- Sessions: Timer and session tracking

## Development Notes

- Always ensure backend (`byte-web`) is running
- Use shared services for API calls
- Follow web app patterns for consistency
- Test on both iOS and Android
