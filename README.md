# TaskEase
Task management web service in a Kanban way. Containerized in Docker and developed with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Deploy with Docker

If you're using Docker just clone the repository and from that folder run the command:
`docker-compose up -d --build`

This will bring up all Docker services. Then you should be able to access the application from your browser at `http://localhost:4200` 😸

## Testing the backend

The backend (API) contains a unit testing file in the `tests` folder. They aim to cover all the endpoints of the code. The current coverage is as follows:

![image](https://github.com/alesordo/TaskEase/assets/85616887/1978d1b0-88c5-47ba-9015-d5071c67b33c)

To run the tests type `npm test` from the API directory.

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
