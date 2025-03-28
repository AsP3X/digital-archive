FROM node:20.17.0-slim

# Install basic development tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Install global development dependencies
RUN npm install -g typescript ts-node nodemon

# Set working directory
WORKDIR /workspace

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=development
ENV PATH=/workspace/node_modules/.bin:$PATH 