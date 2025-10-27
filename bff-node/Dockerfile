# ---- 1. A Imagem Base ----
FROM node:18-alpine

# ---- 2. Configurando o Ambiente ----
WORKDIR /app

# ---- 3. Copiando as Dependências ----
COPY package.json package-lock.json ./

# ---- 4. Instalando as Dependências de Produção ----
RUN npm install --omit=dev

# ---- 5. Copiando o Código da Aplicação ----
COPY . .

# ---- 6. Expondo a Porta ----
# Este serviço roda na porta 3000
EXPOSE 3000

# ---- 7. O Comando Final ----
CMD [ "npm", "start" ]