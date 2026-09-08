# Dockerfile for PDF Suite Backend
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    # OCR
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    tesseract-ocr-asm \
    # PDF processing
    ghostscript \
    qpdf \
    poppler-utils \
    # LibreOffice for conversion
    libreoffice \
    # ImageMagick for image processing
    imagemagick \
    # Java for DSS
    default-jre-headless \
    # Python dependencies
    python3-dev \
    gcc \
    libc-dev \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set up LibreOffice
ENV LIBREOFFICE_PATH=/usr/bin/libreoffice

# Set up Tesseract
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Fix ImageMagick policy for PDF
RUN sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml

# Create app directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./
RUN npm ci --only=production

# Copy Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create temp directories
RUN mkdir -p /app/temp/uploads /app/temp/outputs /app/temp/temp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Start server
CMD ["node", "server.js"]