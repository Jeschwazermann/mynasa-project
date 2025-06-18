# syntax=docker/dockerfile:1
FROM node:lts-alpine

WORKDIR /app

# Copy root package files including custom install scripts
COPY package*.json ./

# Copy child package files
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies via custom scripts
RUN npm run install-client 
RUN npm run install-server 

# Copy the rest of the application
COPY client/ ./client/
COPY server/ ./server/

# Build the React app (output to ../server/public)
RUN npm run build --prefix client

# Set non-root user and expose port
USER node
EXPOSE 8000

# Start the server
CMD ["npm", "start", "--prefix", "server"]
