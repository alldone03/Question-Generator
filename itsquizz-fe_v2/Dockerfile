# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy build output from build stage to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config to support React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
