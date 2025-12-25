# syntax=docker/dockerfile:1

# --- Base Stage ---
# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS base

# Setup a non-root user
RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot

WORKDIR /app

# --- Builder Stage ---
# This stage is for building dependencies
FROM base AS builder

# Copy project files
COPY pyproject.toml ./
COPY src/ ./src/
COPY README.md README.md

# Build dependencies in a temporary location
# This creates a lockfile and installs dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system .

# --- Final Stage ---
# This is the final, lean image
FROM base AS final

# Copy installed packages from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code
COPY src/ ./src

# Use the non-root user to run our application
USER nonroot

# Run the application
CMD ["python", "src/free_throw_bot/main.py"]
