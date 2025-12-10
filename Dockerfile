# Dockerfile (Corrected Version)

# --- STAGE 1: Build ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# --- FIX IS HERE ---
# By adding CI=false, we prevent the build from failing on warnings.
# This is the corrected line.
RUN CI=false npm run build

# --- STAGE 2: Serve ---
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
