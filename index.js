import 'dotenv/config';
import Dispatcher from "./src/components/dispatcher.js";
import migrate from "./src/components/migrate.js";
import Logger from "./src/components/logger.js";
import {loadNode, MIGRATE} from "@ralvarezdev/js-mode";

// Load environment variables
loadNode()

// Migration
if (MIGRATE) {
    migrate().then(() => {
        Logger.info("Migration completed")
    })
    process.exit(0)
}

// Initialize dispatcher
const dispatcher = new Dispatcher()

// Start the dispatcher
dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)