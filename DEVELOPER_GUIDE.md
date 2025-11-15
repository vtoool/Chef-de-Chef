# Ghid de Utilizare și Mentenanță: Ansamblul Chef de Chef (Next.js)

Bun venit! Acest ghid te va ajuta să configurezi, să rulezi și să gestionezi noul website al ansamblului "Chef de Chef", construit cu Next.js, Supabase și Resend.

## 1. Arhitectura Proiectului

*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS
*   **Bază de date:** Supabase (pentru rezervări, mesaje, etc.)
*   **Email-uri:** Resend (pentru notificări)
*   **Hosting:** Vercel

## 2. Configurare Inițială

### Pasul 2.1: Servicii Necesare

Asigură-te că ai conturi pe următoarele platforme:

*   **GitHub:** Pentru stocarea codului.
*   **Vercel:** Pentru hosting.
*   **Supabase:** Pentru baza de date.
*   **Resend:** Pentru trimiterea de email-uri.

### Pasul 2.2: Instalare Locală

1.  Clonează repository-ul de pe GitHub pe calculatorul tău.
2.  Navighează în directorul proiectului folosind un terminal.
3.  Rulează comanda `npm install` pentru a instala toate pachetele necesare.

## 3. Configurarea Cheilor Secrete (Environment Variables)

Securitatea este esențială. Toate cheile și datele sensibile sunt gestionate prin variabile de mediu.

1.  În directorul proiectului, găsește fișierul `.env.local.example`.
2.  Creează o copie a acestui fișier și redenumește-o în `.env.local`.
3.  Deschide `.env.local` și completează valorile corespunzătoare:

    *   **`NEXT_PUBLIC_SUPABASE_URL`**: Mergi la Supabase -> Project Settings -> API -> Project URL.
    *   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Mergi la Supabase -> Project Settings -> API -> Project API Keys -> `anon` (public).
    *   **`RESEND_API_KEY`**: Mergi la Resend -> API Keys -> Create API Key. **Atenție:** Salvează cheia, va fi afișată o singură dată.
    *   **`FROM_EMAIL`**: Adresa de email pe care ai verificat-o în Resend (ex: `noreply@domeniultau.com`).
    *   **`ADMIN_EMAIL`**: Adresa ta de email unde vrei să primești notificările (ex: `contact@chefdechef.md`).

Fișierul `.env.local` este ignorat de Git și nu va fi niciodată publicat.

## 4. Configurarea Bazei de Date Supabase

1.  Creează un proiect nou în Supabase.
2.  După ce proiectul este gata, navighează la **SQL Editor**.
3.  Deschide fișierul `supabase_schema.sql` din proiectul tău.
4.  Copiază tot conținutul fișierului și lipește-l în SQL Editor din Supabase.
5.  Apasă butonul **RUN**. Acest script va crea automat toate tabelele necesare (`bookings`, `contact_messages`, etc.).

## 5. Rularea Proiectului Local

După ce ai configurat fișierul `.env.local`, poți porni site-ul pe calculatorul tău.

1.  Deschide un terminal în directorul proiectului.
2.  Rulează comanda `npm run dev`.
3.  Deschide browser-ul și accesează `http://localhost:3000`.

Acum poți vedea site-ul și poți face modificări în cod, care se vor reflecta instantaneu.

## 6. Publicarea Website-ului (Deployment)

Vom folosi Vercel pentru a publica site-ul live, deoarece se integrează perfect cu Next.js.

1.  Asigură-te că ai publicat codul tău pe un repository GitHub.
2.  Mergi pe **Vercel** și apasă `Add New...` -> `Project`.
3.  Selectează `Import Git Repository` și alege repository-ul tău de pe GitHub.
4.  **Configurarea Environment Variables în Vercel:**
    *   În timpul procesului de import, Vercel va avea o secțiune numită `Environment Variables`.
    *   Aici trebuie să adaugi **toate** variabilele din fișierul tău `.env.local` (ex: `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY`, etc.) cu valorile lor corespunzătoare.
    *   Acest pas este **crucial** pentru ca site-ul live să se poată conecta la Supabase și Resend.
5.  Apasă butonul **Deploy**.
6.  Așteaptă câteva minute. Vercel va construi și publica site-ul, oferindu-ți un link public.

## 7. Administrarea Conținutului

### Modificarea Textelor

Majoritatea textelor (titluri, descrieri) se află direct în componentele React din directorul `/components`. De exemplu, pentru a schimba textul principal, editează `components/Hero.tsx`.

### Adăugarea de Testimoniale sau Imagini în Galerie

Aceste date sunt stocate în Supabase.

1.  Mergi la proiectul tău **Supabase**.
2.  În meniul din stânga, selectează **Table Editor**.
3.  Alege tabelul pe care vrei să-l editezi (ex: `testimonials` sau `media_assets`).
4.  Apasă `+ Insert row` pentru a adăuga o intrare nouă. Completează câmpurile și apasă `Save`. Modificările vor apărea pe site (poate fi necesar un refresh).
