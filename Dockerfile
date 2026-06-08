FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production=false

COPY ktex-backend/package.json ktex-backend/package-lock.json ./ktex-backend/
RUN cd ktex-backend && npm ci --production

COPY . .

RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "start.cjs"]
