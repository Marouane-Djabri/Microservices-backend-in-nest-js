# ---- Base build image ----
FROM node:20-alpine AS deps
WORKDIR /app
# Install only production deps first (will be pruned later); include dev for build
COPY package*.json ./
RUN npm ci

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---- Production runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
ENV NODE_ENV=production

# Copy package files and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built dist
COPY --from=builder /app/dist ./dist

# (Optional) Copy swagger assets if you generate any (uncomment if needed)
# COPY --from=builder /app/swagger-static ./swagger-static

# Set environment variable defaults (override at runtime)
ENV PORT=3000

EXPOSE 3000

USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/').catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]