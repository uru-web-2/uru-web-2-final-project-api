import 'dotenv/config';
import Dispatcher from "./src/components/dispatcher.js";

// Initialize dispatcher
const dispatcher = new Dispatcher()
dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)