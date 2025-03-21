# Use Node.js 20 as the base image
FROM node:20-slim

# Install dependencies for Puppeteer/Chromium, audio capture, and transcription tools
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  libgconf-2-4 \
  libnss3 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libgdk-pixbuf2.0-0 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libxss1 \
  libxtst6 \
  libnss3-dev \
  fonts-liberation \
  libappindicator3-1 \
  libnspr4 \
  lsb-release \
  ffmpeg \
  xvfb \
  pulseaudio \
  python3 \
  python3-pip \
  python3-venv \
  && rm -rf /var/lib/apt/lists/*

# Set up Python virtual environment
RUN python3 -m venv /opt/whisper-env
RUN /opt/whisper-env/bin/pip install --upgrade pip

# Install Whisper (Python package) in the virtual environment
RUN /opt/whisper-env/bin/pip install openai-whisper

# Ensure whisper is available in the system path
ENV PATH="/opt/whisper-env/bin:$PATH"

# Set the working directory for Node.js app
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (if present)
COPY package*.json yarn.lock ./ 

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application using yarn
CMD ["yarn", "start"]