import formidable from "formidable";
import {
    ARTICLES_PATH,
    BOOKS_PATH,
    FORM_FILE_NAME,
    FORM_IMAGES_NAME,
    IMAGES_PATH,
    MAGAZINE_ISSUES_PATH,
    THESES_PATH,
    uploadArticleFile,
    uploadBookFile, uploadImage,
    uploadMagazineIssueFile,
    uploadThesisFile
} from "./files.js";
import * as fs from "node:fs";
import {v4 as uuidv4} from "uuid";

// Constants
const FILE_EXTENSION= '.pdf'

// Upload book file from form
export async function uploadBookFileFromForm(req, res, bookID) {
    const form = new formidable.IncomingForm();
    form.uploadDir = BOOKS_PATH
    form.keepExtensions = true;

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file)
            throw new Error('No file uploaded')

        // Check if the file is a PDF
        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        const buffer = fs.readFileSync(file.path)

        // Save the file
        await uploadBookFile(bookID, FILE_EXTENSION,buffer)
    })
}

// Upload article file from form
export async function uploadArticleFileFromForm(req, res, articleID) {
    const form = new formidable.IncomingForm();
    form.uploadDir = ARTICLES_PATH
    form.keepExtensions = true;

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file)
            throw new Error('No file uploaded')

        // Check if the file is a PDF
        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        const buffer = fs.readFileSync(file.path)

        // Save the file
        await uploadArticleFile(articleID, FILE_EXTENSION , buffer)
    })
}

// Upload a thesis file from form
export async function uploadThesisFileFromForm(req, res, thesisID) {
    const form = new formidable.IncomingForm();
    form.uploadDir = THESES_PATH
    form.keepExtensions = true;

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file)
            throw new Error('No file uploaded')

        // Check if the file is a PDF
        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        const buffer = fs.readFileSync(file.path)

        // Save the file
        await uploadThesisFile(thesisID, FILE_EXTENSION, buffer)
    })
}

// Upload a magazine issue file from form
export async function uploadMagazineIssueFileFromForm(req, res, magazineIssueID) {
    const form = new formidable.IncomingForm();
    form.uploadDir = MAGAZINE_ISSUES_PATH
    form.keepExtensions = true;

    // Parse the form
    await form.parse(req, async (err, fields, files) => {
        if (err)
            throw err

        const file = files?.[FORM_FILE_NAME];
        if (!file)
            throw new Error('No file uploaded')

        // Check if the file is a PDF
        if (file.type !== 'application/pdf')
            throw new Error('File is not a PDF')

        // Get the file buffer
        const buffer = fs.readFileSync(file.path)

        // Save the file
        await uploadMagazineIssueFile(magazineIssueID, FILE_EXTENSION, buffer)
    })
}

// Upload some image files from form
export async function uploadImagesFromForm(req, res, bookID) {
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
            imagesNamesWithExtensions.push(`${imageUUID}.${extension}`)
        }
    });

    return imagesNamesWithExtensions
}