import DatabaseManager from "../../../../components/database.js";
import {CREATE_BOOK_PROC} from "../../../../database/model/storedProcedures.js";
import {
    PDF_FILE_EXTENSION, uploadArticleFile,
    uploadImage
} from "../../../../components/files.js";
import {
    getImagesFromForm, getPDFFileBufferFromForm,
} from "../../../../components/formidable.js";

// Service for the article object
export class ArticleService {
    // Creates an article
    async CreateArticle(req, body) {
        // Upload images from form
        const {imagesExtensionsByUUID, imagesBuffersByUUID}= await getImagesFromForm(req)

        // Get the PDF file buffer
        const pdfBuffer = await getPDFFileBufferFromForm(req)

        // Create the article
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

        // Get the article ID
        const articleID = queryRes.rows?.[0]?.out_article_id

        // Save the PDF file
        if (pdfBuffer)
            await uploadArticleFile(articleID, PDF_FILE_EXTENSION,pdfBuffer)

        // Save the images
        for (const imageUUID in imagesBuffersByUUID)
            await uploadImage(imageUUID, imagesExtensionsByUUID[imageUUID], imagesBuffersByUUID[imageUUID])
        
        return articleID
    }
}

// Singleton instance of the article service
export default new ArticleService();