import DatabaseManager from "../../../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {CREATE_BOOK_PROC} from "../../../../database/model/storedProcedures.js";
import {
    PDF_FILE_EXTENSION,
    uploadBookFile,
    uploadImage
} from "../../../../components/files.js";
import {
    getImagesFromForm,
    getPDFFileBufferFromForm,
} from "../../../../components/formidable.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {BOOKS_UNIQUE_ISBN,} from "../../../../database/model/constraints.js";

// Service for the book object
export class BookService {
    // Creates a book
    async CreateBook(req, body) {
        // Upload images from form
        const {
            imagesExtensionsByUUID,
            imagesBuffersByUUID
        } = await getImagesFromForm(req, false)

        // Get the PDF file buffer
        const pdfBuffer = await getPDFFileBufferFromForm(req, false)

        try {
            // Create the book
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_BOOK_PROC,
                req.session.userID,
                body.document_title,
                body.document_description,
                body.document_release_date,
                body.document_pages,
                body.document_authors.join(','),
                body.document_topic_ids,
                body.document_location_section_ids,
                body.document_language_ids,
                Object.keys(imagesExtensionsByUUID),
                Object.values(imagesExtensionsByUUID),
                body.book_isbn,
                body.book_publisher_id,
                null,
                null
            );
            const queryRow = queryRes.rows?.[0];
            if (queryRow?.out_book_publisher_id_is_valid === false)
                throw new FieldFailError(400,
                    'book_publisher_id',
                    'Publisher ID is invalid'
                )

            // Get the book ID
            const bookID = queryRow?.out_book_id

            // Save the PDF file
            if (pdfBuffer)
                await uploadBookFile(bookID, PDF_FILE_EXTENSION, pdfBuffer)

            // Save the images
            for (const imageUUID in imagesBuffersByUUID)
                await uploadImage(imageUUID,
                    imagesExtensionsByUUID[imageUUID],
                    imagesBuffersByUUID[imageUUID]
                )

            return bookID
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique ISBN constraint
            if (constraintName === BOOKS_UNIQUE_ISBN)
                throw new FieldFailError(400,
                    'book_isbn',
                    'ISBN is already taken'
                )

            throw error
        }
    }
}

// Singleton instance of the book service
export default new BookService();