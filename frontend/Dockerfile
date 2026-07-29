FROM node:22-alpine

WORKDIR /app

# Copia arquivos de dependência do frontend
COPY package*.json ./

# Instala dependências do Angular e Tailwind
RUN npm install

# Copia o restante do código fonte do frontend
COPY . .

# Expõe a porta padrão do dev server do Angular
EXPOSE 4200

# Executa o dev server escutando em todas as interfaces de rede (0.0.0.0)
# para permitir que a porta mapeada seja acessível de fora do container.
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
