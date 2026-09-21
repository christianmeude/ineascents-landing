# Inea Scents - Customer Landing Page

> The customer-facing web application and marketing landing page for the Inea Scents platform.

## 🌍 The Ecosystem

The Inea Scents platform consists of three separate repositories. This repository relies on the backend for data:
1. **`ineascents-landing` (This Repo)**: React/Vite customer-facing marketing website.
2. **`ineascents-backend`**: Laravel backend, PostgreSQL database, and Admin Dashboard.
3. **`ineascents-app`**: Flutter cross-platform mobile application for customer bookings.

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The application will launch and typically be available at `http://localhost:5173`.

## 📋 Prerequisites

- Node.js
- NPM

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: Oxlint

## ✨ Features

- **Marketing Hub**: Public entry point detailing the Inea Scents experience.
- **Responsive Design**: Mobile-first design adapting to all screen sizes.
- **Integration Ready**: Configured to connect with the backend for dynamic package loading and inquiry submissions.

## 🔌 Connectivity

This frontend application relies on the `ineascents-backend` Backend API for dynamic data. When developing locally, ensure the backend repository is running simultaneously (usually at `http://127.0.0.1:8000`) so that API requests can resolve correctly.

---
*Status: Active Development*
