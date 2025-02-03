FROM python

# Set the working directory
WORKDIR /app

# Copy the project files into the container
COPY . .

# Install Hatch
RUN pip install hatch

# Install the Python dependencies using Hatch
RUN hatch env create

# Run the main.py file using Hatch
CMD ["hatch", "run", "python", "src/free_throw_bot/main.py"]