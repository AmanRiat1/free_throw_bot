FROM python
WORKDIR /app
COPY . .
RUN pip install hatch
RUN hatch env create
CMD ["hatch", "run", "python", "src/free_throw_bot/main.py"]