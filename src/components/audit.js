import DatabaseManager from './database.js';
import {CREATE_AUDIT_ENTRY_PROC} from "../database/model/storedProcedures.js";
import Logger from "./logger.js";

// Audit function
export default async function (req, body) {
    // Get the IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Create a new audit entry
    const queryRes=await DatabaseManager.rawQuery(CREATE_AUDIT_ENTRY_PROC,
        req?.session?.userID,
        req?.session?.profileID,
        body,
        ip,
        null,
        null
    )
    const queryRow = queryRes.rows?.[0];
    if (queryRow?.out_user_id_is_valid === false) {
        Logger.error(`Audit entry creation failed for user ${req?.session?.userID} and profile ${req?.session?.profileID}`);
        return
    }
    if (queryRow?.out_profile_id_is_valid === false) {
        Logger.error(`Audit entry creation failed for user ${req?.session?.userID} and profile ${req?.session?.profileID}`);
        return
    }

    // Log the audit
    Logger.info(`Audit entry created for user ${req?.session?.userID} and profile ${req?.session?.profileID}`);
}