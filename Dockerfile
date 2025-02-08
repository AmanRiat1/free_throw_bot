FROM python:alpine
WORKDIR /app
RUN apk add --no-cache gcc g++ musl-dev
COPY . .
RUN pip install --no-cache-dir hatch
RUN hatch env create
CMD ["hatch", "run", "python", "src/free_throw_bot/main.py"]