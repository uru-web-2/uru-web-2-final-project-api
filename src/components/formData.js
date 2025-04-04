import {FORM_FILE_NAME, FORM_IMAGES_NAME,} from "./files.js";
import * as fs from "node:fs";
import {v4 as uuidv4} from "uuid";

// Get a PDF file buffer from form
export function getPDFFileBufferFromFormData(req, isRequired = true) {
    const files = req?.files ?? []
    const file = files.filter(file=>file?.fieldname === FORM_FILE_NAME)[0];
    if (!file) {
        if (isRequired)
            throw new Error('No file uploaded')
        return
    }

    if (file.mimetype !== 'application/pdf')
        throw new Error('File is not a PDF')

    // Get the file buffer
    return file.buffer
}

// Get image files from form
export function getImagesFromFormData(req, isRequired = true) {
    const files = req?.files ?? []
    const images = files.filter(file=>file?.fieldname === FORM_IMAGES_NAME)

    // Image extensions by UUID, and the image buffer by UUID
    const imagesExtensionsByUUID = {}
    const imagesBuffersByUUID = {}

    // Parse the form
    if (!images) {
        if (isRequired)
            throw new Error('No file uploaded');
        return
    }

    // Ensure images is an array
    const imagesArray = Array.isArray(images) ? images : [images];

    // Process each image
    for (const image of imagesArray) {
        // Get the image buffer
        const buffer = fs.readFileSync(image.path);

        // Generate a UUID for the image
        const imageUUID = uuidv4()

        // Get the extension
        const extension = image.mimetype.split('/').pop()

        // Save the image buffer
        imagesBuffersByUUID[imageUUID] = buffer

        // Save the image extension
        imagesExtensionsByUUID[imageUUID] = extension
    }

    return {imagesExtensionsByUUID, imagesBuffersByUUID}
}