import {fileURLToPath} from "url";
import {dirname} from "path";
import Dispatcher from "./src/components/dispatcher.js";
import dotenv from 'dotenv';

// Get the file name and directory
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Initialize dispatcher
const dispatcher = new Dispatcher()
dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_BACKEND_PORT)