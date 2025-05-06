# Zone of Inhibition Tracker

A backend service for tracking zone of inhibition experiments.

---

## Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:loicpirez/zone-of-inhibition-tracker.git
   cd zone-of-inhibition-tracker/backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file based on `.env.sample`:
   ```bash
   cp .env.sample .env
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

## Running Tests

- Run all tests:
  ```bash
  yarn test
  ```

- Run tests with coverage:
  ```bash
  yarn test:coverage
  ```

## Debugging

- Use the `logger` utility to add debug logs.
- Check the `logs/` directory for error and combined logs.

## Deployment

1. Build the project:
   ```bash
   yarn build
   ```

2. Start the production server:
   ```bash
   yarn start
   ```

## Required Variables

- `PORT`: The port on which the server will run (default: `3000`).
- `UPLOAD_DIR`: Directory for storing uploaded files.
- `LOGS_DIR`: Directory for storing log files.
- `DATA_DIR`: Directory for storing data files.

## Example `.env` File

```env
PORT=3000
UPLOAD_DIR=/tmp/uploads
LOGS_DIR=/tmp/logs
DATA_DIR=/tmp/data
```

---

## API Endpoints

### `POST /api/file`
- **Description**: Upload a file and save its metadata along with diameters.
- **Restrictions**:
  - **Allowed File Formats**: Only image files (`.jpg`, `.png`) are allowed.
  - **Maximum File Size**: 5 MB.
  - **Validation**: File validation is currently based on the filename and its extension.
- **Request**:
  - **Headers**:
    - `Content-Type: multipart/form-data`
  - **Body**:
    - Form-data: `file` (required)
- **Response**:
  - **Success (200)**:
    ```json
    {
      "message": "File uploaded successfully",
      "file": {
        "id": "file-id",
        "originalName": "example.jpg",
        "mimeType": "image/jpeg",
        "size": 102400,
        "createdAt": "2025-05-04T12:34:56.789Z",
        "diameters": [
          { "disk": 1, "diameterMm": 10 },
          { "disk": 2, "diameterMm": 15 }
        ]
      }
    }
    ```
  - **Error (400)**: Missing file, invalid file type, or file too large.
    ```json
    {
      "error": {
        "message": "No file uploaded",
        "code": "NO_FILE_UPLOADED"
      }
    }
    ```

---

### `GET /api/file/`
- **Description**: List all uploaded files with their metadata and diameters.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "data": [
        {
          "id": "file-id",
          "originalName": "example.jpg",
          "mimeType": "image/jpeg",
          "size": 102400,
          "createdAt": "2025-05-04T12:34:56.789Z",
          "diameters": [
            { "disk": 1, "diameterMm": 10 },
            { "disk": 2, "diameterMm": 15 }
          ]
        }
      ]
    }
    ```
  - **Error (500)**: Internal server error.
    ```json
    {
      "error": {
        "message": "Internal server error",
        "code": "INTERNAL_ERROR"
      }
    }
    ```

---

### `GET /api/file/:id`
- **Description**: Retrieve metadata for a specific file by its ID.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "data": {
        "file": {
          "id": "file-id",
          "originalName": "example.jpg",
          "mimeType": "image/jpeg",
          "size": 102400,
          "createdAt": "2025-05-04T12:34:56.789Z",
          "diameters": [
            { "disk": 1, "diameterMm": 10 },
            { "disk": 2, "diameterMm": 15 }
          ]
        }
      }
    }
    ```
  - **Error (404)**: File not found.
    ```json
    {
      "error": {
        "message": "File not found",
        "code": "FILE_NOT_FOUND"
      }
    }
    ```
  - **Error (400)**: Invalid file ID format.
    ```json
    {
      "error": {
        "message": "Invalid UUID format",
        "code": "INVALID_UUID"
      }
    }
    ```

---

### `GET /api/file/download/:id`
- **Description**: Download a file by its ID.
- **Response**:
  - **Success (200)**: File download.
    - The file is returned as an attachment.
  - **Error (404)**: File not found.
    ```json
    {
      "error": {
        "message": "File not found",
        "code": "FILE_NOT_FOUND"
      }
    }
    ```
  - **Error (400)**: Invalid file ID format.
    ```json
    {
      "error": {
        "message": "Invalid UUID format",
        "code": "INVALID_UUID"
      }
    }
    ```

---

### `DELETE /api/file/:id`
- **Description**: Delete a file by its ID.
- **Response**:
  - **Success (204)**: No content.
  - **Error (404)**: File not found.
    ```json
    {
      "error": {
        "message": "File not found",
        "code": "FILE_NOT_FOUND"
      }
    }
    ```
  - **Error (500)**: Internal server error (e.g., permission denied).
    ```json
    {
      "error": {
        "message": "Internal server error",
        "code": "INTERNAL_ERROR"
      }
    }
    ```

---

## Notes

- All responses are in JSON format, except for file downloads.
- The `path` attribute of files is excluded from all API responses for security reasons.
- Ensure the `.env` file is correctly configured before starting the server.
- Use the `x-mock-filename` header in tests to simulate file uploads with specific filenames.

---

## Example Usage

### Upload a File
```bash
curl -X POST http://localhost:3000/api/file \
  -H "Content-Type: multipart/form-data" \
  -F "file=@example.jpg"
```

### List Files
```bash
curl -X GET http://localhost:3000/api/file/
```

### Get File Metadata
```bash
curl -X GET http://localhost:3000/api/file/<file-id>
```

### Download a File
```bash
curl -X GET http://localhost:3000/api/file/download/<file-id> -O
```

### Delete a File
```bash
curl -X DELETE http://localhost:3000/api/file/<file-id>
```