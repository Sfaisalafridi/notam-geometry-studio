# Use official Python runtime
FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt .
# Add PyYAML explicitly if missing, though it should be in requirements
RUN pip install --no-cache-dir -r requirements.txt PyYAML

# Copy backend code
COPY backend ./backend

# Create a non-root user (Required for Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
