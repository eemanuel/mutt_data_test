FROM node:24-alpine3.21
RUN mkdir /frontend
WORKDIR /frontend
COPY . /frontend
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
