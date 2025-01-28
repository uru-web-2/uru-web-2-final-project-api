import Logger from "./logger.js";
import {ErrorHandler} from "@ralvarezdev/js-express";

// Create a new error handler
const ERROR_HANDLER = new ErrorHandler(Logger);
export default ERROR_HANDLER