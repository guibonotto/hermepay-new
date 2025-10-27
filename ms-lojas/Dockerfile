# ---- 1. A Imagem Base (O Ingrediente Principal) ----
# Começamos com uma imagem oficial do Node.js (versão 18-alpine).
# 'alpine' é uma versão super leve do Linux, ótima para produção.
FROM node:18-alpine

# ---- 2. Configurando o Ambiente ----
# Define o "diretório de trabalho" dentro do container.
# É como criar uma pasta C:\app dentro da máquina virtual.
WORKDIR /app

# ---- 3. Copiando os "Ingredientes Secos" (Dependências) ----
# Copia os arquivos que listam nossas dependências.
COPY package.json package-lock.json ./

# ---- 4. Instalando as Dependências ----
# Instala apenas as dependências de produção (ignora o 'nodemon').
RUN npm install --omit=dev

# ---- 5. Copiando o Resto do "Recheio" (Nosso Código) ----
# Copia todo o resto do nosso código (controllers, routes, models) para o container.
COPY . .

# ---- 6. Expondo a Porta ----
# Avisa ao Docker que nossa aplicação rodará na porta 3001.
EXPOSE 3001

# ---- 7. O Comando Final (Para Ligar o Forno) ----
# O comando que será executado quando o container iniciar.
# Usa "npm start" (que definimos no package.json para 'node index.js').
CMD [ "npm", "start" ]