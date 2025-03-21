import 'dotenv/config';
import Dispatcher from "./src/components/dispatcher.js";

// Start the dispatcher
Dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)
