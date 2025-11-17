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

### 4.1 Initial Setup

These instructions are for setting up the database for the first time.

1.  Create a new project in Supabase.
2.  Once the project is ready, navigate to the **SQL Editor**.
3.  Copy the entire SQL script from the "4.3 Full SQL Script for Setup" section below.
4.  Paste the script into the Supabase SQL Editor and click the **RUN** button. This will create all necessary tables, security policies, and sample data.

### 4.2 Updating an Existing Database

If you have a previously working version of the site and are updating the code, your database schema might be out of date. If you encounter errors (e.g., `Could not find the 'notes_interne' column`), it means your `bookings` table is missing a column.

Run the following SQL commands in your Supabase SQL Editor to add the missing columns:

```sql
-- This command adds the 'notes_interne' column needed for internal admin notes on bookings.
-- It is safe to run even if the column already exists.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes_interne text NULL;

-- This command adds the 'currency' column for multi-currency support.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS currency text NULL DEFAULT 'MDL'::text;
```

### 4.3 Full SQL Script for Setup

```sql
-- Chef de Chef Supabase Schema
-- Version 1.6 - Client Management Update

-- 1. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    event_date date NOT NULL,
    event_type text NOT NULL,
    location text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    notes text NULL,
    notes_interne text NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    price numeric NULL,
    prepayment numeric NULL,
    payment_status text NULL DEFAULT 'neplatit'::text,
    currency text NULL DEFAULT 'MDL'::text,
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('neplatit', 'avans platit', 'platit integral')),
    CONSTRAINT bookings_status_check CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed')),
    CONSTRAINT bookings_currency_check CHECK (currency IN ('MDL', 'EUR', 'USD'))
);
COMMENT ON TABLE public.bookings IS 'Stores booking requests from the website.';

-- 2. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    message text NOT NULL,
    CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
COMMENT ON TABLE public.contact_messages IS 'Stores messages sent through the contact form.';

-- 3. Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    emails jsonb NULL,
    phones jsonb NULL,
    notes_interne text NULL,
    CONSTRAINT clients_pkey PRIMARY KEY (id)
);
COMMENT ON TABLE public.clients IS 'Stores unified client information.';


-- 4. Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    name text NOT NULL,
    event_type text NOT NULL,
    message text NOT NULL,
    rating smallint NOT NULL,
    CONSTRAINT testimonials_pkey PRIMARY KEY (id),
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
COMMENT ON TABLE public.testimonials IS 'Stores customer testimonials.';

-- 5. Create media_assets table for gallery
CREATE TABLE IF NOT EXISTS public.media_assets (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    type text NOT NULL DEFAULT 'image'::text,
    url text NOT NULL,
    thumbnail_url text NULL,
    description text NULL,
    CONSTRAINT media_assets_pkey PRIMARY KEY (id)
);
COMMENT ON TABLE public.media_assets IS 'Stores images and videos for the gallery.';

-- 6. Create a secure VIEW for public calendar data
-- This view exposes only the necessary event dates, protecting client PII.
CREATE OR REPLACE VIEW public.public_booking_dates AS
  SELECT event_date
  FROM public.bookings
  WHERE (status = 'pending'::text OR status = 'confirmed'::text);

-- 7. Database Function for Client Upserting
CREATE OR REPLACE FUNCTION upsert_client(client_name text, client_email text, client_phone text)
RETURNS void AS $$
DECLARE
    client_id uuid;
    existing_phones jsonb;
BEGIN
    -- Check if a client with this email already exists
    SELECT id, phones INTO client_id, existing_phones
    FROM public.clients
    WHERE emails @> jsonb_build_array(client_email)
    LIMIT 1;

    IF client_id IS NOT NULL THEN
        -- Client exists, check if phone needs to be added
        IF existing_phones IS NULL OR NOT existing_phones @> jsonb_build_array(client_phone) THEN
            UPDATE public.clients
            SET phones = COALESCE(existing_phones, '[]'::jsonb) || jsonb_build_array(client_phone)
            WHERE id = client_id;
        END IF;
    ELSE
        -- Client does not exist, insert new record
        INSERT INTO public.clients (name, emails, phones)
        VALUES (client_name, jsonb_build_array(client_email), jsonb_build_array(client_phone));
    END IF;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION public.upsert_client IS 'Automatically creates or updates a client record from a booking or contact form submission.';


-- 8. Set up Row Level Security (RLS) for all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- 9. Clean up old policies before creating new ones
DROP POLICY IF EXISTS "Allow public read access to all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin read access" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin update access" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert for bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin full access for bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public insert for contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin read access for contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin full access for clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public read access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow admin full access for testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public read access to media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Allow admin full access for media" ON public.media_assets;

-- 10. Create new RLS policies
-- Bookings:
-- Allow public to create new bookings via the website form.
CREATE POLICY "Allow public insert for bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) full access to manage bookings.
CREATE POLICY "Allow admin full access for bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
  
-- NOTE: The insecure public read policy has been REMOVED. Public access is now handled by the 'public_booking_dates' view.


-- Contact Messages:
-- Allow public to create new contact messages.
CREATE POLICY "Allow public insert for contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
-- Allow authenticated users (admins) to read all messages.
CREATE POLICY "Allow admin read access for contact" ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- Clients:
-- Allow authenticated users (admins) full access.
CREATE POLICY "Allow admin full access for clients" ON public.clients
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Testimonials:
-- Allow public to read all testimonials.
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
-- Allow authenticated users (admins) to manage testimonials.
CREATE POLICY "Allow admin full access for testimonials" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Media Assets:
-- Allow public to read all media assets for the gallery.
CREATE POLICY "Allow public read access to media assets" ON public.media_assets FOR SELECT USING (true);
-- Allow authenticated users (admins) to manage media assets.
CREATE POLICY "Allow admin full access for media" ON public.media_assets FOR ALL USING (auth.role() = 'authenticated');


-- 11. Insert sample data (if tables are empty)
-- Sample Testimonials
INSERT INTO public.testimonials (name, event_type, message, rating)
SELECT 'Ana & Ion Popescu', 'Nuntă', 'Ați fost absolut fantastici! Ați creat o atmosferă de poveste și toți invitații au fost impresionați. Recomandăm cu toată inima!', 5
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Ana & Ion Popescu');

INSERT INTO public.testimonials (name, event_type, message, rating)
SELECT 'Familia Cojocaru', 'Cumătrie', 'Profesionalism și mult suflet. Ați făcut din cumătria fetiței noastre un eveniment de neuitat. Mulțumim!', 5
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Familia Cojocaru');

INSERT INTO public.testimonials (name, event_type, message, rating)
SELECT 'Tech Solutions SRL', 'Eveniment Corporate', 'Oaspeții noștri din străinătate au fost fascinați de programul vostru. O pată de culoare și tradiție la petrecerea noastră corporate.', 5
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = 'Tech Solutions SRL');

-- Sample Media Assets for Gallery
INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/1/600/400', 'https://picsum.photos/seed/1/300/200', 'Eveniment 1'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/1/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/2/600/400', 'https://picsum.photos/seed/2/300/200', 'Eveniment 2'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/2/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/3/600/400', 'https://picsum.photos/seed/3/300/200', 'Eveniment 3'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/3/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/4/600/400', 'https://picsum.photos/seed/4/300/200', 'Eveniment 4'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/4/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/5/600/400', 'https://picsum.photos/seed/5/300/200', 'Eveniment 5'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/5/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/6/600/400', 'https://picsum.photos/seed/6/300/200', 'Eveniment 6'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/6/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/7/600/400', 'https://picsum.photos/seed/7/300/200', 'Eveniment 7'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/7/600/400');

INSERT INTO public.media_assets (type, url, thumbnail_url, description)
SELECT 'image', 'https://picsum.photos/seed/8/600/400', 'https://picsum.photos/seed/8/300/200', 'Eveniment 8'
WHERE NOT EXISTS (SELECT 1 FROM public.media_assets WHERE url = 'https://picsum.photos/seed/8/600/400');

```

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