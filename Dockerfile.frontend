# Etapa 1: Build
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY .env* ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilar la app
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo lo necesario desde el build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/.env* ./

# Exponer el puerto
EXPOSE 3000

# Comando para correr en producción
CMD ["npm", "start"]
