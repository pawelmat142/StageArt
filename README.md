


![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)


![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-8D3FFC?style=for-the-badge&logo=ngrx&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-1976D2?style=for-the-badge&logo=primeng&logoColor=white)



# StageArt

> A modern platform for managing artist bookings, events, and digital documents. Includes advanced features for collaboration, document generation, and seamless communication. Demo instance filled with sample data for demonstration purposes only.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Author & Contact](#author--contact)

---

## Overview

StageArt is a prototype web application designed to streamline the process of connecting event organizers with artists. The platform simplifies the discovery, booking, and management of artist engagements, enabling seamless collaboration between users. With its intuitive interface, StageArt helps users focus on creating memorable events while minimizing administrative tasks.

**Demo:** [http://136.113.70.83/](http://136.113.70.83/)

### Target Users
- **Artists**: Showcase their profiles and attract potential collaborators.
- **Artist Managers**: Manage artist profiles and handle booking requests.
- **Event Promoters**: Find, book, and coordinate with artists for their events.

---

## Features

### For Artists
- Artist portfolio: bios, photos, and past performances
- Profile management

### For Artist Managers
- Manage multiple artist profiles
- Handle incoming booking requests
- Document generation and signing (PDF)

### For Event Promoters
- Search and filter artists by style, availability, etc.
- Submit and manage booking requests
- Event scheduling and management

### General
- Authentication & authorization (JWT)
- Notifications and admin panel
- Telegram integration
- Data stored in MongoDB
- Logging (Winston)
- PDF generation (Puppeteer)

---


## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), Mongoose, MongoDB, JWT, Puppeteer, Cloudinary
- **Frontend:** [Angular](https://angular.io/), NgRx, SCSS
- **Other:** Docker, GitHub Copilot, Ubuntu

---


## Project Structure
```
book-agency/
├── backend/                  # NestJS API, business logic, PDF generation
│   ├── src/
│   │   ├── artist/           # Artist management (controllers, services, models)
│   │   ├── booking/          # Booking logic, models, services
│   │   ├── document/         # Document and PDF generation, contract signatures
│   │   ├── event/            # Event management
│   │   ├── feedback/         # Feedback module
│   │   ├── form/             # Forms and form data
│   │   ├── global/           # Global utilities, logger, exceptions
│   │   ├── pdf/              # PDF generation and templates
│   │   ├── profile/          # User profiles, authentication
│   │   ├── telegram/         # Telegram bot integration
│   │   └── ...
│   ├── logs/                 # Backend logs
│   └── ...
│
│
├── frontend/                 # Angular SPA
│   ├── src/
│   │   ├── app/              # Main app code (components, modules, services)
│   │   ├── assets/           # Static assets (images, styles)
├── README.md                 # Documentation
└── ...
```

---

## Deployment

All services (MongoDB, backend, frontend) are orchestrated with Docker Compose. Make sure Docker and Docker Compose are installed before proceeding.

### Prerequisites — `.env` file

Create a `.env` file in the project root. Both dev and production compose files read from it.

```env
# Mongo
MONGO_INITDB_ROOT_USERNAME=<your-mongo-username>
MONGO_INITDB_ROOT_PASSWORD=<your-mongo-password>
MONGO_URI=<your-mongodb-uri>

PORT=8003

# JWT
JWT_SECRET=<your-jwt-secret>

# Angular (production build only)
ANGULAR_API_URI=<your-api-uri>
ANGULAR_TEST_API_URI=<your-test-api-uri>

# Cloudinary
ANGULAR_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
ANGULAR_CLOUDINARY_UPLOAD_PRESET=<your-cloudinary-upload-preset>
ANGULAR_CLOUDINARY_BASE_URL=<your-cloudinary-base-url>

# (Optional) Telegram
SKIP_TELEGRAM=false
ADMIN_TELEGRAM_CHAT_ID=<your-admin-chat-id>
TELEGRAM_BOT_NAME=<your-bot-name>
TELEGRAM_BOT_TOKEN=<your-bot-token>
TELEGRAM_LOGIN_URL=http://127.0.0.1:4200/login
SECRET_KEY=<your-secret-key>
```

---

### Development (`docker-compose.dev.yml`)

Starts all services with hot-reload. Backend source and frontend source are mounted as volumes so changes are reflected immediately without rebuilding.

| Service  | Port(s)        | Notes                          |
|----------|----------------|--------------------------------|
| mongo    | 27017          | MongoDB 6.0                    |
| backend  | 8003, 9229     | NestJS; 9229 = Node.js debugger |
| frontend | 4200           | Angular dev server             |

```bash
# First run / full rebuild
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d

# Subsequent starts
docker compose -f docker-compose.dev.yml up -d
```

The app is available at `http://localhost:4200`. The backend API is at `http://localhost:8003`.

---

### Production (`docker-compose.yml`)

Builds optimised images. Angular environment variables are injected at build time via `--build-arg`. Frontend is served by Nginx on ports 80/443. All services restart automatically unless stopped manually.

| Service  | Port(s) | Notes                                      |
|----------|---------|--------------------------------------------|
| mongo    | 27017   | MongoDB 6.0, data persisted in `mongo_data` volume |
| backend  | 8003    | NestJS production build                    |
| frontend | 80, 443 | Angular app served by Nginx               |

```bash
# First run / full rebuild
docker compose down
docker compose build --no-cache
docker compose up -d

# Subsequent starts
docker compose up -d
```

---

### External services

#### Cloudinary
- Required for storing artist avatars and photos.
- Create a free account at [Cloudinary](https://cloudinary.com/), create an upload preset, and fill in the `ANGULAR_CLOUDINARY_*` variables in `.env`.

#### Telegram Bot (optional)
- Create a bot via [BotFather](https://t.me/botfather) and set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`, and `ADMIN_TELEGRAM_CHAT_ID` in `.env`.
- Set `SKIP_TELEGRAM=true` to disable the integration entirely.



---

## Author & Contact
- Paweł Małek - [website](https://drawit-pawel-malek.netlify.app/)

---

> This is a demo project. All data is fictional and for presentation purposes only.
