# Use Node base image
FROM node:20-slim

# Install git and other common dev tools
RUN apt-get update && apt-get install -y \
    git \
    procps \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev", "--", "--host"]
