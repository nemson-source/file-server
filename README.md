# File Server

This is a simple file server that allows uploading and downloading files.

## Features

- Upload files via a web form 
- View uploaded image and PDF files directly in the browser
- Download uploaded files
- List all uploaded files

## Usage

1. Clone the repository
2. create a folder `views` then moove `index.ejs` into the fodler
3. Run `npm install` to install dependencies
4. Run `node index.js` to start the server
5. Open `http://localhost:3000` in your browser

## Code Overview

The main dependencies are:

- `express` - web framework 
- `multer` - for handling file uploads
- `ejs` - for rendering templates

The index.js file:

- Sets up the Express app and configures EJS as the template engine
- Configures Multer for handling file uploads
- Renders the main page with a list of uploaded files
- Handles requests for downloading and uploading files

The templates/index.ejs file:

- Displays the upload form and list of uploaded files
- Shows uploaded images and PDFs directly in the page

The public/uploads folder is where the uploaded files are saved.

## License

[Apache-2.0 license](LICENSE)
