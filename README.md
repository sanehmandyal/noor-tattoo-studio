# Noor Tattooz Studio — MERN Production Architecture

A full-stack, production-ready MERN application for **Noor Tattooz Studio** (Una, Himachal Pradesh), engineered with clean modular folder architecture, strict validation, secure authentication, and high performance.

---

## Project Structure

```text
noor-tattoo-studio/
├── client/                     # Vite + React 18 Frontend
│   ├── public/                 # Static assets, logos, and high-res tattoo photography
│   ├── src/                    # React components, pages, context, and styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express + Mongoose Backend
│   ├── config/                 # Database and third-party service connections
│   │   ├── db.js               # MongoDB connection handler
│   │   └── cloudinary.js       # Cloudinary cloud storage configuration
│   ├── controllers/            # Request handlers and business logic
│   │   ├── crudFactory.js      # Reusable CRUD controller builder
│   │   ├── authController.js   # Login, logout, session verification, password resets
│   │   ├── userController.js   # Super Admin user account management
│   │   ├── artistController.js # Artist profiles and specialties
│   │   ├── galleryController.js# Tattoo portfolio artwork showcase
│   │   ├── serviceController.js# Studio services, pricing, and FAQ items
│   │   ├── blogController.js   # Expert tattoo guides and aftercare articles
│   │   ├── testimonialController.js # Verified 5-star Google reviews
│   │   ├── faqController.js    # Studio FAQs & questions
│   │   ├── bookingController.js# Client session booking & consultation dispatch
│   │   ├── inquiryController.js# General contact inquiries
│   │   ├── settingsController.js# Studio metadata, SEO, and sitemap.xml
│   │   ├── uploadController.js # Image upload handler (Sharp WebP optimization)
│   │   └── statsController.js  # Dashboard analytical stats & monthly chart aggregation
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js             # JWT verification & role-based access control
│   │   ├── errorHandler.js     # Centralized error handler & async wrapper
│   │   ├── rateLimiter.js      # Rate limits for login, forms, and general API
│   │   └── upload.js           # Multer memory storage & MIME validation
│   ├── models/                 # Mongoose schema definitions
│   │   ├── index.js            # Unified export index
│   │   ├── helpers.js          # Shared schema plugins (slugify, SEO)
│   │   ├── User.js
│   │   ├── Artist.js
│   │   ├── Gallery.js
│   │   ├── Service.js
│   │   ├── BlogPost.js
│   │   ├── Testimonial.js
│   │   ├── FAQ.js
│   │   ├── Booking.js
│   │   ├── Inquiry.js
│   │   └── Settings.js
│   ├── routes/                 # Express route definitions
│   │   ├── index.js            # Master API router mounting all modules
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── artistRoutes.js
│   │   ├── galleryRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── faqRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── inquiryRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── statsRoutes.js
│   ├── services/               # Reusable background services
│   │   ├── emailService.js     # Nodemailer SMTP notifications & password reset links
│   │   ├── whatsappService.js  # WhatsApp Business Cloud API owner alerts
│   │   └── storageService.js   # Sharp image processing & Cloudinary / local storage
│   ├── seed/                   # Database seeding scripts
│   │   ├── seed-professional.js# Full production seed (Noor Studio, Una details, reviews)
│   │   └── seed.js             # Minimal initial bootstrap seed
│   ├── uploads/                # Local storage for uploaded images
│   ├── .env                    # Private backend secrets (git-ignored)
│   ├── package.json
│   └── server.js               # Express application entry point
│
├── scripts/                    # Utility and data extraction scripts
│   ├── download_real_tattoos.py
│   ├── scrape_justdial.py
│   └── ...
│
├── .gitignore                  # Git ignore rules
├── .env.example                # Clean environment template
├── README.md                   # Project documentation
└── package.json                # Root development scripts
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
Copy `.env.example` to `server/.env` and provide your secrets:
```bash
cp .env.example server/.env
```

### 3. Seed Database
Seed with authentic Noor Tattooz Studio Una data (services, artists, gallery pieces, Google Maps reviews, and super-admin):
```bash
npm run seed
```

### 4. Run Development Servers
Start backend API:
```bash
npm run server
```
Start frontend client:
```bash
npm run client
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`
* **Admin Portal**: `http://localhost:5173/admin`
