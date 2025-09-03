# Financier AI

A full-stack, AI-powered personal finance application built by an autonomous AI agent.

## Live URL

**Vercel Deployment:** [https://financier-ai-ashy.vercel.app](https://financier-ai-ashy.vercel.app)

**Note:** The application is deployed, but the database is not yet initialized. A valid `POSTGRES_PRISMA_URL` environment variable needs to be set in the Vercel project settings. After that, make a `POST` request to `https://financier-ai-ashy.vercel.app/api/setup` to initialize the database.

## Features

*   **Authentication:** Secure user authentication with JWTs and HttpOnly cookies.
*   **CRUD Operations:** Manage transactions, accounts, and categories.
*   **AI Budget Advisor:** Get personalized financial advice based on your spending habits.
*   **AI Financial Forecasting:** Project your future savings based on historical data.
*   **AI Spending Anomaly Detection:** Get notified about unusual spending patterns.
*   **AI-Assisted Receipt Itemization:** Automatically extract and categorize items from a receipt.
*   **Dashboard:** Visualize your finances with interactive charts.

## Tech Stack

*   **Frontend:** React (Vite), TypeScript, TailwindCSS, shadcn/ui, Zustand, React Query, Recharts, Framer Motion
*   **Backend:** Node.js on Vercel Serverless Functions
*   **Database:** Vercel Postgres with Prisma
*   **AI:** Groq

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Database
POSTGRES_PRISMA_URL="postgres://..."

# Authentication
JWT_SECRET="your-super-secret-key"

# AI
GROQ_API_KEY="gsk_..."
GROQ_MODEL="gemma-2-9b-instruct"
```

## Local Development

To run the project locally, follow these steps:

1.  Clone the repository:
    ```bash
    git clone https://github.com/bojidarandreev/financier-ai.git
    ```
2.  Install dependencies:
    ```bash
    cd financier-ai
    yarn install
    ```
3.  Set up your environment variables in a `.env.local` file.
4.  Push the database schema:
    ```bash
    npx prisma db push
    ```
5.  Run the development server:
    ```bash
    yarn dev
    ```
