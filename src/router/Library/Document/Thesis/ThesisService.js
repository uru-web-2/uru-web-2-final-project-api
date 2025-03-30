import DatabaseManager from "../../../../components/database.js";
import {CREATE_BOOK_PROC} from "../../../../database/model/storedProcedures.js";
import {
    PDF_FILE_EXTENSION,
    uploadImage, uploadThesisFile
} from "../../../../components/files.js";
import {
    getImagesFromForm, getPDFFileBufferFromForm,
} from "../../../../components/formidable.js";

// Service for the thesis object
export class ThesisService {
    // Creates a thesis
    async CreateThesis(req, body) {
        // Upload images from form
        const {imagesExtensionsByUUID, imagesBuffersByUUID}= await getImagesFromForm(req)

        // Get the PDF file buffer
        const pdfBuffer = getPDFFileBufferFromForm(req)

        // Create the thesis
        const queryRes=await DatabaseManager.rawQuery(
            CREATE_BOOK_PROC,
            req.session.userID,
            body.document_title,
            body.document_description,
            body.document_release_date,
            body.document_pages,
            body.document_author,
            body.document_topic_ids,
            body.document_location_section_ids,
            body.document_language_ids,
            Object.keys(imagesExtensionsByUUID),
            Object.values(imagesExtensionsByUUID),
            null
        );

        // Get the thesis ID
        const thesisID = queryRes.rows?.[0]?.out_thesis_id

        // Save the PDF file
        await uploadThesisFile(thesisID, PDF_FILE_EXTENSION,pdfBuffer)

        // Save the images
        for (const imageUUID in imagesBuffersByUUID)
            await uploadImage(imageUUID, imagesExtensionsByUUID[imageUUID], imagesBuffersByUUID[imageUUID])

        return thesisID
    }
}

// Singleton instance of the thesis service
export default new ThesisService();