# Multi-stage build for Flutter app
FROM ubuntu:20.04 as base

# Set environment variables
ENV FLUTTER_HOME="/opt/flutter"
ENV FLUTTER_VERSION="3.16.5"
ENV PATH="$FLUTTER_HOME/bin:$PATH"

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-11-jdk \
    wget \
    cmake \
    ninja-build \
    pkg-config \
    libgtk-3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME
WORKDIR $FLUTTER_HOME
RUN git fetch && git checkout $FLUTTER_VERSION
RUN flutter doctor
RUN flutter config --enable-web

# Set up the app
WORKDIR /app
COPY . .

# Get Flutter dependencies
RUN flutter pub get

# Build for web
RUN flutter build web --release

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=base /app/build/web /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
