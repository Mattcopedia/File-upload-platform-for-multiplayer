FROM node:18-alpine
# ARGUMENTS

ARG NEXT_PUBLIC_BASE_URL
# ARG NODE_ENV

ARG NEXT_PUBLIC_ENVIRONMENT


# ENV NODE_ENV=$NODE_ENV

ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT


# Set the working directory
WORKDIR /app

COPY package*.json ./



# Build the application (while still root)
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the desired port
EXPOSE 3000

# Build the application (while still root)
RUN npm run build

CMD [ "npm", "run", "start" ]


