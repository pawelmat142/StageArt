FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# Build to a local path (angular.json outputs to ../backend/dist/angular by default,
# here we override for the container build)
RUN npx ng build

# --- Nginx stage ---
FROM nginx:alpine

COPY --from=builder /app/frontend/dist/browser /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

ENV NODE_OPTIONS="--max-old-space-size=512"
