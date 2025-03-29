import DatabaseManager from "../../../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {CREATE_BOOK_PROC} from "../../../../database/model/storedProcedures.js";
import {getBookRelativePath} from "../../../../components/files.js";

// Service for the book object
export class BookService {
    // Create a book
    async CreateBook(req, body) {
        // Get file relative URL
        getBookRelativePath()
        /*

        try {
            await DatabaseManager.rawQuery(
                CREATE_BOOK_PROC,
                req.session.userID,
                body.document_title,
                body.document_description,
                body.document_release_date,
                body.document_pages,
                body.document_author,

                body.document_id
            );
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique document ID and author ID constraint
            if (constraintName === DOCUMENT_AUTHORS_UNIQUE_DOCUMENT_ID_AUTHOR_ID)
                throw new FieldFailError(400,
                    'author_id',
                    'Author is already assigned to document'
                )
            throw error
        }
    }

 IN in_document_topic_ids BIGINT[],
    IN in_document_location_section_ids BIGINT[],
    IN in_document_language_ids BIGINT[],
    IN in_document_document_image_urls VARCHAR[],
    IN in_book_isbn VARCHAR,
    IN in_book_publisher_id BIGINT
*/
    }
}

// Singleton instance of the book service
export default new BookService();