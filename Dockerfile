# Dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# --host-0.0.0.0 allows things outside of the container to see it (The mongoDB)
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]