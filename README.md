# Zone of Inhibition Tracker

A backend service for tracking zone of inhibition experiments.

---

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.sample`.
4. Start the development server: `npm run dev`.

---

## API Endpoints

### `POST /api/file`
- **Description**: Upload a file.
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
        "createdAt": "2025-05-04T12:34:56.789Z"
      }
    }
    ```
  - **Error (400)**: Missing file, invalid file type, or file too large.

---

### `GET /api/file/list`
- **Description**: List all uploaded files.
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
          "createdAt": "2025-05-04T12:34:56.789Z"
        }
      ]
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
          "createdAt": "2025-05-04T12:34:56.789Z"
        }
      }
    }
    ```
  - **Error (404)**: File not found.
  - **Error (400)**: Invalid file ID format.

---

### `GET /api/file/download/:id`
- **Description**: Download a file by its ID.
- **Response**:
  - **Success (200)**: File download.
  - **Error (404)**: File not found.
  - **Error (400)**: Invalid file ID format.

---

### `DELETE /api/file/:id`
- **Description**: Delete a file by its ID.
- **Response**:
  - **Success (204)**: No content.
  - **Error (404)**: File not found.
  - **Error (500)**: Internal server error (e.g., permission denied).

---

## Notes

- All responses are in JSON format, except for file downloads.
- The `path` attribute of files is excluded from all API responses for security reasons.
- Ensure the [.env](http://_vscodecontentref_/2) file is correctly configured before starting the server.
