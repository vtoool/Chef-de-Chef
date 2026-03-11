---
title: Chef de Chef - Ansamblu de Dansuri Populare
subtitle: Platformă web completă pentru gestionarea unui ansamblu de dansuri populare din Moldova
heroImage: /images/hero.webp
---

## Provocarea

Ansamblul de dansuri populare **Chef de Chef** din Moldova avea nevoie de o prezență online modernă care să:
- Prezinte serviciile și galeria foto/video
- Permită clienților să facă rezervări direct de pe site
- Oferă un sistem administrativ pentru gestionarea evenimentelor
- Funcționeze fără dependență de baze de date complexe

---

## Soluția

Am dezvoltat o aplicație web completă cu Next.js 14 care include:

### 1. Landing Page Elegant
- Design modern cu tematică tradițională moldovenească
- Hero section cu imagini locale optimizate în format WebP
- Secțiuni pentru servicii, galerie, despre noi și contact
- Design responsiv pentru toate dispozitivele

### 2. Galerie Foto & Video
- 8 imagini de înaltă calitate convertite în WebP
- Modal pentru vizualizare detaliată
- Încărcare rapidă prin optimizare automată

### 3. Formulare de Contact și Rezervări
- **Formular de rezervare** cu:
  - Calendar interactiv pentru selectarea datei
  - Tipuri de evenimente (Nuntă, Cumătrie, Petrecere, Corporativă)
  - Date de contact complete
  - Trimitere directă via Web3Forms
- **Formular de contact** cu:
  - Câmpuri pentru nume, email, telefon, mesaj
  - Integrare Web3Forms pentru livrare instantă

### 4. Panou Administrativ Complet
- **Dashboard principal** cu:
  - Tabel de rezervări cu filtre și sortare
  - Calendar vizual pentru evenimente
  - Modal pentru editarea detaliilor rezervării
  - Calcul automat al plăților (total, avans, rămas)
- **Panou Clienți** cu:
  - Lista completă de clienți
  - Date de contact multiple
  - Notițe interne pentru administrativ
- **Rezumat** cu:
  - Statistici despre venituri și evenimente
  - Grafic pie pentru tipurile de evenimente

### 5. Acces Demo
- Variantă demo fără autentificare
- Date simulate pentru prezentare
- Interfață identică cu panoul real

---

## Tehnologii Utilizate

| Tehnologie | Descriere |
|------------|-----------|
| **Next.js 14** | Framework React pentru aplicații web |
| **TypeScript** | Tipizare statică pentru cod sigur |
| **Tailwind CSS** | Stilizare modernă și responsivă |
| **Web3Forms** | Procesare formulare fără backend |
| **Sharp** | Optimizare imagini WebP |
| **date-fns** | Manipulare date calendaristice |

---

## Detalii Tehnice

### Optimizare Imagini
- Conversie automată PNG/JPG → WebP
- Comprimare la calitate 80%
- Flip orizontal automat pentru imaginea "Despre Noi"
- Favicon generat automat la 32x32

### Formulare
- Trimitere directă către Web3Forms API
- Subiect personalizat pentru fiecare tip de cerere
- Fără dependență de Supabase pentru funcționalitate
- API routes păstrate pentru extensii viitoare

### Admin Dashboard
- Autentificare Supabase (opțional)
- Componente reutilizabile pentru calendar și tabele
- Design mobil-responsive
- Toast notifications pentru feedback

---

## Rezultate

- **Viteză**: Imagini optimizate pentru încărcare rapidă
- **Simplitate**: Formulare trimise direct, fără baze de date
- **Flexibilitate**: Variantă demo pentru prezentări
- **Profesionalism**: Panou admin complet pentru gestionare

---

## Concluzie

Proiectul Chef de Chef demonstrează cum o aplicație modernă poate transforma prezența online a unei companii tradiționale. Combinând tehnologii web actuale cu specificul cultural local, am creat o platformă care:
- Atrage clienții prin design atractiv
- Facilitează comunicarea prin formulare simple
- Eficientizează gestionarea prin panoul admin

---

*Let`s discuss your project*

Doriți o platformă similară pentru afacerea dumneavoastră? Contactați-ne pentru o consultație gratuită.
