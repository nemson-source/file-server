# File Upload Server

This is a simple file upload server built with Node.js using Express and Multer. 

## Features

- Allows users to upload image files (JPG, JPEG, PNG) and PDF documents
- Saves uploaded files to the `uploads` folder
- Displays uploaded images and PDFs back to the user
- Progress bar during file upload 
- Only allows file extensions in the allowed list

## Usage

### Install Dependencies

```
npm install
```

### Run Server

```
node index.js
```

Server will run on port 3000.

The `index.html` page allows users to upload files. Uploaded files are saved in the `uploads` folder.

Allowed file extensions:

- .jpg
- .jpeg 
- .png
- .pdf

The server will reject any other file types.

### File Display

- **Images**: The image will be displayed back to the user after a successful upload 
- **PDFs**: The PDF is embedded and displayed in the browser using an `<iframe>`
- **Other Files**: A message states that the file was uploaded successfully but cannot be displayed

## Implementation

- Express is used to create the server
- Multer handles file uploads and storage
- File filter checks allowed file extensions
- PDFs and images are displayed differently after upload
- Basic styling and progress bar on client side

Overall, this provides a simple working example of handling file uploads in a Node server.
