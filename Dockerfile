# Imagen oficial de Node.js compatible con pnpm 11.5.0
FROM node:24-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Activamos pnpm con Corepack
RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalamos dependencias, incluyendo devDependencies porque usamos ts-node
# HUSKY=0 evita que husky intente ejecutar hooks dentro del contenedor
RUN HUSKY=0 pnpm install --frozen-lockfile --prod=false

# Copiamos el resto del proyecto
COPY . .

# Puerto usado por la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]