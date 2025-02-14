import 'dotenv/config';
import migrate from "./src/components/migrate.js";
import {loadNode} from "@ralvarezdev/js-mode";

// Load environment variables
loadNode()

// Migrate the database
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