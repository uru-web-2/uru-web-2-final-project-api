import Logger from "@ralvarezdev/js-logger";
import {debug, dev, prod, save} from "@ralvarezdev/js-mode";
import path from 'path'
import {__dirname} from "../../index.js";

// Save log files config
const SAVE_CONFIG = {
    save: [save],
    logPath: path.join(__dirname, "log"),
    logFilename: "app.log"
}

// Print log entry types depending on mode
const LOG_ENTRY_TYPES = {
    [prod]: {
        warning: true,
        error: true,
        info: false,
        debug: false,
    },
    [dev]: {
        info: true,
        warning: true,
        error: true,
        debug: false,
    },
    [debug]: {
        info: true,
        warning: true,
        error: true,
        debug: true,
    }
}

// Create a new logger
const LOGGER = new Logger({
    ...SAVE_CONFIG,
    ...LOG_ENTRY_TYPES
})
export default LOGGER