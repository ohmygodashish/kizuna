FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps

COPY . .

# RUN npm run build

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "run", "dev"]

# Notes:
# - Set all required environment variables (Google credentials, API keys, etc.) in Cloud Run.
# - For production, ensure NODE_ENV=production is set in Cloud Run settings.
