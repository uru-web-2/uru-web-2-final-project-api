import formidable from "formidable";
import {
    FORM_FILE_NAME,
    FORM_IMAGES_NAME,
    getImageRelativePath,
    IMAGES_PATH,
    uploadImage,
} from "./files.js";
import * as fs from "node:fs";
import {v4 as uuidv4} from "uuid";

// Get a PDF file buffer from form
export async function getPDFFileBufferFromForm(req) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    // Parse the form
    let buffer = null
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file)
            throw new Error('No file uploaded')

        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        buffer = fs.readFileSync(file.path)
    })

    return buffer
}

// Upload some image files from form
export async function uploadImagesFromForm(req) {
    const form = new formidable.IncomingForm();
    form.uploadDir = IMAGES_PATH
    form.keepExtensions = true;

    // Images names with extensions
    const imagesNamesWithExtensions = []

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err;

        const uploadedFiles = files[FORM_IMAGES_NAME];
        if (!uploadedFiles)
            throw new Error('No file uploaded');

        // Ensure uploadedFiles is an array
        const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

        // Process each file
        for (const file of filesArray) {
            // Save the file
            const buffer = fs.readFileSync(file.path);

            // Generate a UUID for the image
            const imageUUID = uuidv4()

            // Get the extension
            const extension = file.name.split('.').pop()

            await uploadImage(imageUUID, extension, buffer)

            // Add the image name with extension to the array
            imagesNamesWithExtensions.push([imageUUID, extension])
        }
    });

    return imagesNamesWithExtensions.map(([imageUUID, extension]) => getImageRelativePath( imageUUID, extension))
}