# Imagen oficial de Node.js
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Activamos pnpm con Corepack
RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias, incluyendo devDependencies porque usamos ts-node
RUN pnpm install --frozen-lockfile --prod=false

# Copiamos el resto del proyecto
COPY . .

# Puerto usado por la app en local
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]