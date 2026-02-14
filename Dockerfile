# Build stage - compiles the application
FROM node:20-alpine AS builder

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy config and dependency files
COPY package.json bun.lock tsconfig.json next.config.ts ./

# Copy source code
COPY src ./src
COPY public ./public
COPY .env.local .env.local

# Install all dependencies
RUN bun install --frozen-lockfile

# Build the Next.js application
RUN SKIP_TYPE_CHECK=true bun run build

# Runtime stage - minimal production image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Install bun in runtime
RUN npm install -g bun

# Copy package files
COPY package.json bun.lock ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copy environment file
COPY .env.local .env.local

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "run", "start"]
