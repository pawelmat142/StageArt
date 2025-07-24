


![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)


![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
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

**Demo:** [http://130.162.34.50:8003/](http://130.162.34.50:8003/)

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

- **Backend:** [NestJS](https://nestjs.com/), Mongoose, MongoDB, JWT, Puppeteer, Firebase Storage
- **Frontend:** [Angular](https://angular.io/), NgRx, SCSS
- **Other:** GitHub Copilot, Ubuntu

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

### Backend (NestJS)
1. Go to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server with hot-reload:
```bash
npm run start:dev
```

### Frontend (Angular)
1. Go to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the application:
```bash
ng serve
```

The frontend app will be available at `http://localhost:4200` by default.

---


## Deployment

### Example manual deployment on Ubuntu server



#### 1. **Build the backend**
- Go to the backend directory and build the project:
    ```bash
    cd backend
    npm install
    npm run build
    cd ..
    ```

#### 2. **Build the frontend**
- Go to the frontend directory and build the Angular app:
    ```bash
    cd frontend
    npm install
    ng build
    cd ..
    ```

#### 3. **Prepare the dist directory**
- First, make sure the `dist` directory does not exist or is empty to avoid conflicts.
- Then create a new `dist` directory and copy the backend build, package files, and environment config:
```bash
rm -rf dist
mkdir dist
cp -r backend/dist dist
cp backend/package.json dist
```

#### 4. **Create the .env file in the dist directory**
- Create a `.env` file inside `dist` (or copy a template and edit it).
- Example `.env` content:
```env
PORT=8003

# JWT
JWT_SECRET=<your-jwt-secret>

#MONGO
MONGO_URI=<your-mongodb-uri>

# FIREBASE
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_CLIENT_EMAIL=<your-firebase-client-email>
FIREBASE_PRIVATE_KEY=yo<ur-firebase-private-key>

# (Optional) TELEGRAM
SKIP_TELEGRAM=false
ADMIN_TELEGRAM_CHAT_ID=<your-admin-chat-id>
TELEGRAM_BOT_NAME=<your-bot-name>
TELEGRAM_BOT_TOKEN=<your-bot-token>
TELEGRAM_LOGIN_URL=http://127.0.0.1:4200/login
SECRET_KEY=<your-secret-key>
```
- In the next steps, you will fill in these variables with your actual credentials and configuration values.


#### 5. **Configure MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a database user and get your connection string (URI).
- Update the `MONGO_URI` variable in your `.env` file with this URI.

#### 6. **Configure Firebase Storage**
- Required for storing artist avatars, photos, and potentially event images.
- Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable Firebase Storage and generate a service account key.
- Add the relevant Firebase credentials (project ID, client email, private key) to your `.env` file.
- Make sure your storage rules are set appropriately for your use case.

#### 7. **(Optional) Configure Telegram Bot**
- Create a bot using [BotFather](https://t.me/botfather) on Telegram and obtain the bot token.
- Set the `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_NAME`, and `ADMIN_TELEGRAM_CHAT_ID` in your `.env` file.
- Set `SKIP_TELEGRAM=false` to enable Telegram integration, or `true` to disable.


#### 8. **Push the dist directory to your server**
- You can use `scp`, `rsync`, or git to transfer the `dist` directory to your server.

#### 9. **Install system dependencies for Puppeteer**
- On your Ubuntu server, install required libraries:
```bash
sudo apt-get update
sudo apt-get install -y \
ca-certificates fonts-liberation libappindicator3-1 libasound2 \
libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libdrm2 \
libgbm1 libgtk-3-0 libnspr4 libnss3 libu2f-udev libx11-xcb1 \
libxcomposite1 libxdamage1 libxrandr2 xdg-utils wget
```

#### 10. **Install Node.js dependencies (production only)**
- In the `dist` directory on your server, run:
```bash
npm ci --omit=dev
```

#### 11. **Start the app with PM2**
- Still in the `dist` directory, run:
```bash
pm2 start book.js
```



---

## Author & Contact
- Paweł Małek - [website](https://drawit-pawel-malek.netlify.app/)

---

> This is a demo project. All data is fictional and for presentation purposes only.
