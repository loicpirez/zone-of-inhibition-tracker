# Zone of Inhibition Tracker (ZOIT)

The **Zone of Inhibition Tracker (ZOIT)** is a web-based application designed to streamline the process of managing and analyzing zone of inhibition data. It consists of two main components: a frontend and a backend, which work together to provide a seamless user experience.

---

## Repository Structure

- **Frontend**: Available on the [frontend branch](https://github.com/loicpirez/zone-of-inhibition-tracker/tree/frontend). Built using React, TypeScript, and TailwindCSS.
- **Backend**: Available on the [backend branch](https://github.com/loicpirez/zone-of-inhibition-tracker/tree/backend). Built using Node.js and Express.

---

## Tech Stack

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router
- **API Integration**: Axios
- **Notifications**: React Toastify
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

### Backend
- **Framework**: Express
- **Language**: JavaScript (Node.js)
- **Database**: File-based storage (configurable via `.env`)
- **Logging**: Winston
- **Testing**: Jest
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier

---

## Running the Application

To run the application, clone the repository into two separate directories for the frontend and backend, and follow the setup instructions for each.

### 1. Clone the Repository
Clone the repository twice into separate directories for the frontend and backend:

```bash
# Clone the frontend
git clone -b frontend https://github.com/loicpirez/zone-of-inhibition-tracker.git zone-of-inhibition-tracker-frontend

# Clone the backend
git clone -b backend https://github.com/loicpirez/zone-of-inhibition-tracker.git zone-of-inhibition-tracker-backend
```

### 2. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd zone-of-inhibition-tracker-backend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file based on `.env.sample`:
   ```bash
   cp .env.sample .env
   ```
4. Start the backend server:
   ```bash
   yarn dev
   ```

### 3. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../zone-of-inhibition-tracker-frontend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file based on `.env.sample`:
   ```bash
   cp .env.sample .env
   ```
4. Start the frontend development server:
   ```bash
   yarn dev
   ```

### 4. Access the Application
- Open the frontend in your browser at `http://localhost:5173`.
- Ensure the backend is running on the port specified in its `.env` file (default: `3001`).

---

## Notes
- The frontend and backend communicate via REST APIs. Ensure the `VITE_ZOIT_API_URL` in the frontend `.env` file matches the backend's base URL.
- For production deployment, refer to the respective README files in the [frontend branch](https://github.com/loicpirez/zone-of-inhibition-tracker/tree/frontend) and [backend branch](https://github.com/loicpirez/zone-of-inhibition-tracker/tree/backend).

---