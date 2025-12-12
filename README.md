# Inmolibiaria Platform

A real estate platform built with Next.js, Tailwind CSS, and PostgreSQL for cataloging and lead capture.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** PostgreSQL with Prisma ORM
- **Styling:** Soft Brutalism / Minimalismo
  - Background: #F2EFE9
  - Text: #2C2621
  - Fonts: Montserrat/Syne for titles, Roboto Mono/Courier for data

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   - Configure your PostgreSQL connection in `.env`
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- Property catalog with visual cards
- Lead capture functionality (upcoming)
- Responsive design

## Project Structure

- `src/app/` - Next.js app directory
- `src/components/` - Reusable components
- `prisma/` - Database schema and migrations
