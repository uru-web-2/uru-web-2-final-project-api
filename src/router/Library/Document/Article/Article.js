import {HandleValidation, SuccessJSendBody} from "@ralvarezdev/js-express";
import Validator from "../Article/ArticleValidator.js";
import Service from "../Article/ArticleService.js";
import Logger from "../../../../components/logger.js";

// Article object for the article module
export class Article {
    // Creates an article
    async CreateArticle(req, res) {
        // Validate the request
        const body = HandleValidation(req, res, Validator.CreateArticle);

        // Create the article
        const articleID = await Service.CreateArticle(req, body);

        // Log the creation
        Logger.info(`Created article ${articleID} by admin ${req.session.userID}`);

        // Send the response
        res.status(200).json(SuccessJSendBody())
    }
}

// Singleton instance
export default new Article();