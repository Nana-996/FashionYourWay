# FashionYourWay | Luxury Atelier & Haute Couture

> *"FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way."*

---

## 🌟 Overview & Key Features

FashionYourWay is an online luxury boutique and bespoke couture ordering platform tailored for the modern African & global fashionista.

- **Pink Burgundy Luxury Aesthetic**: Curated color palette (`#4A0E23`, `#6B1736`, `#E8A598`, `#200714`, `#FFF5F7`) with glassmorphism, elegant editorial typography (*Playfair Display*, *Cormorant Garamond*, *Outfit*), and micro-animations.
- **Ghanaian Localization (`GH₵`)**: All prices and transactions formatted in Ghanaian Cedis with regional delivery selection (Accra, Kumasi, Takoradi, etc.) and landmark navigation.
- **Product Catalog & Ordering**:
  - Filter by collection (Evening & Gala, Suits, Dresses, Bodysuits, Accessories).
  - Product details modal with size selector, color swatches, size chart guide, stock indicators, and express ordering.
  - Slide-over shopping bag with real-time free delivery progress meter.
  - Multi-step checkout with Ghanaian delivery info (no zip code) and payment options (MTN MoMo / Telecel Cash, Direct Bank Wire, Cash on Delivery).
- **Client Order Tracking**: Real-time status progress stepper (*Pending &rarr; Confirmed &rarr; Processing &rarr; Shipped &rarr; Delivered*), timestamped timeline history, and printable invoices.
- **Private Stealth Admin Management**:
  - **100% Hidden from public visitors** with zero visible admin links.
  - **3 Covert Access Triggers**:
    1. Keyboard Shortcut: `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
    2. Secret URL: Append `?admin` or `#admin` (e.g., `https://your-site.vercel.app/?admin`)
    3. Triple-click the `©` copyright symbol at the footer.
  - **Orders Management**: Live status dropdown that syncs updates directly to the client's tracking view.
  - **Catalog Inventory CRUD**: Add/Edit/Delete products with instant photo upload.
  - **Store Profile & Social Media Manager**: Edit showroom address, phone numbers, working hours, and handles (Instagram, TikTok, WhatsApp, Facebook, Snapchat, X) with automatic official logo generation.

---

## 🚀 Deployment Guide

### Option 1: Deploy to Vercel via GitHub (Recommended)

1. **Initialize Git & Push to GitHub**:
   ```bash
   # Initialize git repository
   git init

   # Stage all files
   git add .

   # Commit changes
   git commit -m "feat: Initial release of FashionYourWay Luxury Atelier"

   # Rename branch to main
   git branch -M main

   # Link your GitHub repository (replace with your repository URL)
   git remote add origin https://github.com/YOUR_USERNAME/FashionYourWay.git

   # Push to GitHub
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New Project"** &rarr; **"Import Git Repository"**.
   - Select your `FashionYourWay` GitHub repository.
   - Vercel automatically detects **Vite**:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click **"Deploy"**.
   - In less than 1 minute, your luxury fashion boutique will be live worldwide with automatic HTTPS and CDN caching!

---

### Option 2: Deploy Directly via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy directly from terminal
vercel

# For production deployment
vercel --prod
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Administrator Passkey
- **Default Security Passkey**: `fashion2026` (or `admin123`)
- The passkey can be customized anytime inside **Admin Dashboard &rarr; Store Profile &rarr; Private Admin Security Passkey**.

---

## 📦 Tech Stack
- **Frontend**: React 18, Vite 6
- **Styling**: Modern Pink Burgundy Design System (Vanilla CSS with CSS Variables)
- **Icons**: Lucide React + Custom SVG Official Social Brand Logos
- **Effects**: Canvas Confetti
- **Deployment**: Vercel SPA Routing with `vercel.json`
