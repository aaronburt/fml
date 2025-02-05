# FML

FML is a Node.js application that demonstrates how to securely upload files via an HTTP endpoint using:
- Express for handling server routes.
- Multer as the file upload middleware.
- A custom Bearer token middleware for simple authentication.

## Features

1. **Bearer Token Authentication**  
   Restricts access to authorized requests only. You must include a valid token in the HTTP `Authorization` header when uploading files.

2. **File Uploads**  
   Uses Multer to handle single-file uploads at a designated endpoint (`/upload`) and stores them on disk with unique filenames.

3. **Error Handling**  
   Returns descriptive messages if the Bearer token is missing or invalid, if no file is provided, or if an unexpected error occurs during processing.

## Getting Started

1. **Clone or Download**  
   Clone this repository or download the source code.

2. **Install Dependencies**  
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```

3. **Run the Server**  
   Start the server:
   ```bash
   npm start
   ```
   The application will listen on a configured port (for example, 3000).

## Usage

1. **Bearer Token**  
   When making a request to `/upload`, include a header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
   Replace `YOUR_TOKEN_HERE` with the valid token.

2. **File Upload**  
   Make a POST request to `/upload` with a form field named `file`:
   ```bash
   curl -X POST \
        -H "Authorization: Bearer YOUR_TOKEN_HERE" \
        -F "file=@/path/to/your/file.txt" \
        http://localhost:3000/upload
   ```
   If the token is valid and the file is provided, you will receive a success message.

3. **Response**  
   - If successful, you’ll see a JSON object containing:
     ```json
     {
       "message": "File uploaded successfully",
       "file": "your-original-filename.ext"
     }
     ```
   - For errors, you’ll receive a JSON object with an `error` message and possibly more details.

## License

This application is provided as is, and you may freely customize it to suit your needs.