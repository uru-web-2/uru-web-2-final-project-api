import 'dotenv/config';
import Dispatcher from "./src/components/dispatcher.js";
import migrate from "./src/components/migrate.js";
import {loadNode, MIGRATE} from "@ralvarezdev/js-mode";

// Load environment variables
loadNode()

if (MIGRATE) {
    migrate().then(
        () => {
            console.log('Migration successful')
            process.exit(0)
        }
    ).catch(
        (error) => {
            console.error('An error occurred while migrating:', error)
            process.exit(1)
        }
    )
}

// Initialize dispatcher
const dispatcher = new Dispatcher()

// Start the dispatcher
dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)