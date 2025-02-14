import 'dotenv/config';
import {loadNode} from "@ralvarezdev/js-mode";
import Dispatcher from "./src/components/dispatcher.js";

// Load environment variables
loadNode()

// Start the dispatcher
Dispatcher.start(process.env.URU_WEB_2_FINAL_PROJECT_API_PORT)
