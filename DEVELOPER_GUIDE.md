# Setup and Maintenance Guide: Ansamblul Chef de Chef (Next.js)

Welcome! This guide will help you set up, run, and manage the new website for the "Chef de Chef" ensemble, built with Next.js, Supabase, and Resend.

## 1. Project Architecture

*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS
*   **Database:** Supabase (for bookings, messages, etc.)
*   **Emails:** Resend (for notifications)
*   **Hosting:** Vercel

## 2. Initial Setup

### Step 2.1: Required Services

Ensure you have accounts on the following platforms:

*   **GitHub:** For code storage.
*   **Vercel:** For hosting.
*   **Supabase:** For the database.
*   **Resend:** For sending emails.

### Step 2.2: Local Installation

1.  Clone the repository from GitHub to your computer.
2.  Navigate into the project directory using a terminal.
3.  Run the command `npm install` to install all necessary packages.

## 3. Configuring Secret Keys (Environment Variables)

Security is essential. All keys and sensitive data are managed through environment variables.

1.  In the project directory, find the file `.env.local.example`.
2.  Create a copy of this file and rename it to `.env.local`.
3.  Open `.env.local` and fill in the corresponding values:

    *   **`NEXT_PUBLIC_SUPABASE_URL`**: Go to Supabase -> Project Settings -> API -> Project URL.
    *   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Go to Supabase -> Project Settings -> API -> Project API Keys -> `anon` (public).
    *   **`RESEND_API_KEY`**: Go to Resend -> API Keys -> Create API Key. **Note:** Save this key, as it will only be shown once.
    *   **`FROM_EMAIL`**: The email address you have verified in Resend (e.g., `noreply@yourdomain.com`).
    *   **`ADMIN_EMAIL`**: Your email address where you want to receive notifications (e.g., `contact@chefdechef.md`).

The `.env.local` file is ignored by Git and will never be published.

## 4. Setting Up the Supabase Database

1.  Create a new project in Supabase.
2.  Once the project is ready, navigate to the **SQL Editor**.
3.  Open the `supabase_schema.sql` file from your project.
4.  Copy the entire content of the file and paste it into the Supabase SQL Editor.
5.  Click the **RUN** button. This script will automatically create all the necessary tables (`bookings`, `contact_messages`, etc.).

## 5. Running the Project Locally

After configuring the `.env.local` file, you can start the website on your computer.

1.  Open a terminal in the project directory.
2.  Run the command `npm run dev`.
3.  Open your browser and navigate to `http://localhost:3000`.

You can now view the site and make changes to the code, which will be reflected instantly.

## 6. Publishing the Website (Deployment)

We will use Vercel to publish the site live, as it integrates perfectly with Next.js.

1.  Ensure you have pushed your code to a GitHub repository.
2.  Go to **Vercel** and click `Add New...` -> `Project`.
3.  Select `Import Git Repository` and choose your repository from GitHub.
4.  **Configuring Environment Variables in Vercel:**
    *   During the import process, Vercel will have a section called `Environment Variables`.
    *   Here, you must add **all** the variables from your `.env.local` file (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY`, etc.) with their corresponding values.
    *   This step is **crucial** for the live site to be able to connect to Supabase and Resend.
5.  Click the **Deploy** button.
6.  Wait a few minutes. Vercel will build and publish the site, providing you with a public link.

## 7. Content Management

### Modifying Texts

Most of the texts (titles, descriptions) are located directly in the React components within the `/components` directory. For example, to change the main hero text, edit `components/Hero.tsx`.

### Adding Testimonials or Gallery Images

This data is stored in Supabase.

1.  Go to your **Supabase** project.
2.  In the left-hand menu, select **Table Editor**.
3.  Choose the table you want to edit (e.g., `testimonials` or `media_assets`).
4.  Click `+ Insert row` to add a new entry. Fill in the fields and click `Save`. The changes will appear on the site (a refresh might be necessary).
