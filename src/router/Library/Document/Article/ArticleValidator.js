import {Validate} from "@ralvarezdev/js-joi-parser";
import {
    CREATE_ARTICLE
} from "./ArticleModel.js";

// Validator for the article object
export class ArticleValidator {
    // Validate create article
    CreateArticle(req) {
        return Validate(req, CREATE_ARTICLE);
    }
}

// Singleton instance of the ArticleValidator
export default new ArticleValidator();