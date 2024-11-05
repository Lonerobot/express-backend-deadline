docker build -t deadline-api-proxy .

either this - 

docker run -d -p 3000:3000 --name my-deadline-api-proxy deadline-api-proxy

or better to run this - 

docker-compose up --build -d

docker-compose down - to stop