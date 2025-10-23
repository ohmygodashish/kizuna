# 1. Builder Stage: Build the Next.js application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package manager files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Set build-time environment variables if needed
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application for production
RUN npm run build

# 2. Runner Stage: Create the final, lean image
FROM node:22-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose the port the app will run on
EXPOSE 3000

# The command to start the production server
CMD ["npm", "start"]
