FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# Build-time args from .env (passed via docker-compose build.args)
ARG ANGULAR_API_URI
ARG ANGULAR_TEST_API_URI
ARG ANGULAR_FIREBASE_API_KEY
ARG ANGULAR_FIREBASE_AUTH_DOMAIN
ARG ANGULAR_FIREBASE_PROJECT_ID
ARG ANGULAR_FIREBASE_STORAGE_BUCKET
ARG ANGULAR_FIREBASE_MESSAGING_SENDER_ID
ARG ANGULAR_FIREBASE_APP_ID
ARG ANGULAR_FIREBASE_LOCATION_ID
ARG ANGULAR_CLOUDINARY_CLOUD_NAME
ARG ANGULAR_CLOUDINARY_UPLOAD_PRESET
ARG ANGULAR_CLOUDINARY_BASE_URL

ENV NODE_OPTIONS="--max-old-space-size=512"

# Write environment.ts with literal values before ng build.
# Angular (esbuild) does NOT replace process.env at compile time — values must be baked in.
RUN printf 'export const environment = {\n\
    production: true,\n\
    apiUri: "%s",\n\
    testApiUri: "%s",\n\
    firebaseConfig: {\n\
        apiKey: "%s",\n\
        authDomain: "%s",\n\
        projectId: "%s",\n\
        storageBucket: "%s",\n\
        messagingSenderId: "%s",\n\
        appId: "%s",\n\
        locationId: "%s",\n\
    },\n\
    CLOUDINARY_CLOUD_NAME: "%s",\n\
    CLOUDINARY_UPLOAD_PRESET: "%s",\n\
    CLOUDINARY_BASE_URL: "%s",\n\
};\n' \
    "${ANGULAR_API_URI}" \
    "${ANGULAR_TEST_API_URI}" \
    "${ANGULAR_FIREBASE_API_KEY}" \
    "${ANGULAR_FIREBASE_AUTH_DOMAIN}" \
    "${ANGULAR_FIREBASE_PROJECT_ID}" \
    "${ANGULAR_FIREBASE_STORAGE_BUCKET}" \
    "${ANGULAR_FIREBASE_MESSAGING_SENDER_ID}" \
    "${ANGULAR_FIREBASE_APP_ID}" \
    "${ANGULAR_FIREBASE_LOCATION_ID}" \
    "${ANGULAR_CLOUDINARY_CLOUD_NAME}" \
    "${ANGULAR_CLOUDINARY_UPLOAD_PRESET}" \
    "${ANGULAR_CLOUDINARY_BASE_URL}" \
    > src/environments/environment.ts

# Build to a local path (angular.json outputs to ../backend/dist/angular by default,
# here we override for the container build)
RUN npx ng build

# --- Nginx stage ---
FROM nginx:alpine

COPY --from=builder /app/frontend/dist/browser /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
