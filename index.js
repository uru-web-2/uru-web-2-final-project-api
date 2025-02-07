import 'dotenv/config';
import Dispatcher from "./src/components/dispatcher.js";
import migrate from "./src/components/migrate.js";
import Logger from "./src/components/logger.js";

// Migration
/**/
migrate().then(() => {
    Logger.info("Migration completed")
})
 /**/

// Initialize dispatcher
const dispatcher = new Dispatcher()

// Start the dispatcher
dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)