import {fileURLToPath} from "url";
import path, {dirname} from "path";
import Logger from "@ralvarezdev/js-logger";
import {DEBUG, DEV, MODE, PROD, SAVE} from "@ralvarezdev/js-mode";

// Get the file name and directory
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Save log files config
const SAVE_CONFIG = {
    save: SAVE,
    logPath: path.join(__dirname, "log"),
    logFilename: "app.log"
}

// Print log entry types depending on mode
const LOG_ENTRY_TYPES = {
    [PROD]: {
        warning: true,
        error: true,
        info: false,
        debug: false,
    },
    [DEV]: {
        info: true,
        warning: true,
        error: true,
        debug: false,
    },
    [DEBUG]: {
        info: true,
        warning: true,
        error: true,
        debug: true,
    }
}[MODE]

// Create a new logger
export default new Logger({
    ...SAVE_CONFIG,
    ...LOG_ENTRY_TYPES
})
