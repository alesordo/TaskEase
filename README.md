# TaskEase
Task management web service in a Kanban way. Containerized in Docker and developed with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Deploy with Docker

If you're using Docker just clone the repository and from that folder run the command:
`docker-compose up -d --build`

This will bring up all Docker services. Then you should be able to access the application from your browser at `http://localhost:4200` 😸

## Deploy from source code 👨‍💻

You'll need:
- Node.js (for npm)
- Express.js
- MongoDB
- Angular

### To deploy frontend:

Open a terminal from frontend's directory (taskease-frontend) and run `npm run start`. Frontend will run at `http://localhost:4200`.

### To deploy backend:

Open a terminal from backend's directory (api) and run `npm run start`. Frontend will run at `http://localhost:3000`.

#### Credits:
- Devstackr's [video series](https://www.youtube.com/playlist?list=PLIjdNHWULhPSZFDzQU6AnbVQNNo1NTRpd) about MEAN stack task manager app.
