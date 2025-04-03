import DatabaseManager from "../../../../components/database.js";
import {FieldFailError} from "@ralvarezdev/js-express";
import {
    CREATE_MAGAZINE_ISSUE_PROC
} from "../../../../database/model/storedProcedures.js";
import {
    PDF_FILE_EXTENSION,
    uploadImage,
    uploadMagazineIssueFile
} from "../../../../components/files.js";
import {
    getImagesFromForm,
    getPDFFileBufferFromForm,
} from "../../../../components/formidable.js";
import {PostgresIsUniqueConstraintError} from "@ralvarezdev/js-dbmanager";
import {
    MAGAZINE_ISSUES_UNIQUE_MAGAZINE_ID_ISSUE_NUMBER,
} from "../../../../database/model/constraints.js";

// Service for the magazine issue object
export class MagazineIssueService {
    // Creates a magazine issue
    async CreateMagazineIssue(req, body) {
        // Upload images from form
        const {
            imagesExtensionsByUUID,
            imagesBuffersByUUID
        } = await getImagesFromForm(req)

        // Get the PDF file buffer
        const pdfBuffer = await getPDFFileBufferFromForm(req)

        try {
            // Create the magazine issue
            const queryRes = await DatabaseManager.rawQuery(
                CREATE_MAGAZINE_ISSUE_PROC,
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
                body.magazine_id,
                body.magazine_issue_number,
                null,
                null
            );

            // Check if the magazine ID is valid
            if (!queryRes.rows?.[0]?.out_magazine_id_is_valid)
                throw new FieldFailError(400,
                    'magazine_id',
                    'Magazine ID is invalid'
                )

            // Get the magazine issue ID
            const magazineIssueID = queryRes.rows?.[0]?.out_magazine_issue_id

            // Save the PDF file
            if (pdfBuffer)
                await uploadMagazineIssueFile(magazineIssueID,
                    PDF_FILE_EXTENSION,
                    pdfBuffer
                )

            // Save the images
            for (const imageUUID in imagesBuffersByUUID)
                await uploadImage(imageUUID,
                    imagesExtensionsByUUID[imageUUID],
                    imagesBuffersByUUID[imageUUID]
                )

            return magazineIssueID
        } catch (error) {
            // Check if it is a constraint violation error
            const constraintName = PostgresIsUniqueConstraintError(error)

            // Check if the constraint is the unique magazine ID and issue number constraint
            if (constraintName === MAGAZINE_ISSUES_UNIQUE_MAGAZINE_ID_ISSUE_NUMBER)
                throw new FieldFailError(400,
                    'magazine_issue_number',
                    'Issue number is already taken'
                )

            throw error
        }
    }
}

// Singleton instance of the magazine issue service
export default new MagazineIssueService();