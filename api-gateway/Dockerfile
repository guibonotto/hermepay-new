# Usa uma imagem leve do Node.js
FROM node:18-alpine

# Cria a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (para aproveitar o cache)
COPY package.json package-lock.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia todo o resto do código para dentro do container
COPY . .

# O API Gateway roda na porta 8080 (diferente dos outros)
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["node", "index.js"]