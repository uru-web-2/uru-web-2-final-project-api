import {fileURLToPath} from "url";
import {dirname, resolve, join} from "path";
import * as fs from "node:fs";

// Get the file name and directory
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Document-related paths
export const DOCUMENTS_PATH = resolve(__dirname, '/../../public/documents')
export const BOOKS_PATH = join(DOCUMENTS_PATH, '/books');
export const ARTICLES_PATH = join(DOCUMENTS_PATH, '/articles');
export const THESES_PATH = join(DOCUMENTS_PATH, '/theses');
export const MAGAZINE_ISSUES_PATH = join(DOCUMENTS_PATH, '/magazine_issues');

// Image-related paths
export const IMAGES_PATH = resolve(__dirname, '/../../public/images');

// Form file name
export const FORM_FILE_NAME = 'file';

// Form images name
export const FORM_IMAGES_NAME = 'images';

// Upload an article file
export async function uploadArticleFile(articleID, extension, file) {
    const filePath = join(ARTICLES_PATH, articleID+extension);

    // Create the directory
    await fs.promises.mkdir(ARTICLES_PATH, {recursive: true});

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);
}

// Delete an article file
export async function deleteArticleFile(articleID, extension) {
    const articlePath = join(ARTICLES_PATH, articleID+extension);
    await fs.promises.rm(articlePath, {recursive: true});
}

// Upload a book file
export async function uploadBookFile(bookID, extension, file) {
    const filePath = join(BOOKS_PATH, bookID+extension);

    // Create the directory
    await fs.promises.mkdir(BOOKS_PATH, {recursive: true});

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);
}

// Delete a book file
export async function deleteBookFile(bookID, extension) {
    const bookPath = join(BOOKS_PATH, bookID+extension);
    await fs.promises.rm(bookPath, {recursive: true});
}

// Upload a thesis file
export async function uploadThesisFile(thesisID, extension, file) {
    const filePath = join(THESES_PATH, thesisID+ extension);

    // Create the directory
    await fs.promises.mkdir(THESES_PATH, {recursive: true});

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);
}

// Delete a thesis file
export async function deleteThesisFile(thesisID, extension) {
    const thesisPath = join(THESES_PATH, thesisID+extension);
    await fs.promises.rm(thesisPath, {recursive: true});
}

// Upload a magazine issue file
export async function uploadMagazineIssueFile(magazineIssueID, extension, file) {
    const filePath = join(MAGAZINE_ISSUES_PATH, magazineIssueID+extension);

    // Create the directory
    await fs.promises.mkdir(MAGAZINE_ISSUES_PATH, {recursive: true});

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);
}

// Delete a magazine issue file
export async function deleteMagazineIssueFile(magazineIssueID, extension) {
    const magazineIssuePath = join(MAGAZINE_ISSUES_PATH, magazineIssueID +extension);
    await fs.promises.rm(magazineIssuePath, {recursive: true});
}

// Upload an image
export async function uploadImage(imageUUID, extension, file) {
    const filePath = join(IMAGES_PATH, imageUUID+extension);

    // Create the directory
    await fs.promises.mkdir(IMAGES_PATH, {recursive: true});

    // Save the file
    await fs.promises.writeFile(filePath, file.buffer);
}

// Delete an image
export async function deleteImage(imageUUID, extension) {
    const imagePath = join(IMAGES_PATH, imageUUID+extension);
    await fs.promises.rm(imagePath, {recursive: true});
}