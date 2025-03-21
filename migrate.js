import 'dotenv/config';
import migrate from "./src/components/migrate.js";

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