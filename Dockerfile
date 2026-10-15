
# Build the React + Vite application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Supabase configuration supplied by Jenkins at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

RUN test -n "$VITE_SUPABASE_URL" && \
    test -n "$VITE_SUPABASE_KEY" && \
    npm run build

# Serve the production build with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
