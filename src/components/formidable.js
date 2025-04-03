import formidable from "formidable";
import {FORM_FILE_NAME, FORM_IMAGES_NAME,} from "./files.js";
import * as fs from "node:fs";
import {v4 as uuidv4} from "uuid";

// Get a PDF file buffer from form
export async function getPDFFileBufferFromForm(req, isRequired = true) {
    // Create a form
    const form = formidable({});

    // Parse the form
    let buffer = null
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file) {
            if (isRequired)
                throw new Error('No file uploaded')

            return
        }

        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        buffer = fs.readFileSync(file.path)
    })

    return buffer
}

// Get image files from form
export async function getImagesFromForm(req, isRequired = true) {
    // Create a form
    const form = formidable({});

    // Image extensions by UUID, and the image buffer by UUID
    const imagesExtensionsByUUID = {}
    const imagesBuffersByUUID = {}

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err;

        const uploadedFiles = files[FORM_IMAGES_NAME];
        if (!uploadedFiles) {
            if (isRequired)
                throw new Error('No file uploaded');

            return
        }

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

            // Save the image buffer
            imagesBuffersByUUID[imageUUID] = buffer

            // Save the image extension
            imagesExtensionsByUUID[imageUUID] = extension
        }
    });

    return {imagesExtensionsByUUID, imagesBuffersByUUID}
}