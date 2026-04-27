# Use Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

RUN apk update

RUN apk add git

RUN apk add git ca-certificates
RUN update-ca-certificates

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev", "--", "--host"]
