FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps

COPY . .

# Declare build arguments for environment variables needed during build
ARG GOOGLE_CREDENTIALS_BASE64
ARG GOOGLE_SHEET_ID
ARG GOOGLE_DRIVE_FOLDER_ID
ARG OPENAI_API_KEY

# Make build args available as environment variables during build
ENV GOOGLE_CREDENTIALS_BASE64=$GOOGLE_CREDENTIALS_BASE64
ENV GOOGLE_SHEET_ID=$GOOGLE_SHEET_ID
ENV GOOGLE_DRIVE_FOLDER_ID=$GOOGLE_DRIVE_FOLDER_ID
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN npm run build

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]

# Notes:
# - Set all required environment variables (Google credentials, API keys, etc.) in Cloud Run.
# - For production, ensure NODE_ENV=production is set in Cloud Run settings.
