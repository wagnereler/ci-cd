# Stage de build
FROM node:18-alpine AS build
WORKDIR /app

# copiar manifests de dependências para aproveitar cache
COPY package.json package-lock.json ./
RUN npm ci

# copiar restante do código
COPY . .

# build (ajuste conforme seu projeto)
RUN npm run build

# Stage runtime
FROM node:18-alpine AS runtime
WORKDIR /app

# criação de user não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
