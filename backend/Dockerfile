FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create initial database and seed if needed
# We run this at startup to ensure the DB is ready
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && npm start"]
