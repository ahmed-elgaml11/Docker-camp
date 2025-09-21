FROM node as base
WORKDIR /app
COPY package.json .





FROM base as development
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "run" , "dev" ]





FROM base as builder
RUN npm install
COPY . .
EXPOSE 4000
RUN npm run build




FROM base as production
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD [ "npm", "run" , "start" ]










