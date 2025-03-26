import DeepFreeze from "@ralvarezdev/js-deep-freeze";
import parseDuration from "parse-duration";

// Profiles names
export const PROFILES_NAME = DeepFreeze({
    GUEST: 'Guest',
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    LIBRARIAN: 'Librarian',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
    DEVELOPER: 'Developer'
});

// All profiles names
export const ALL_PROFILES_NAME = Object.values(PROFILES_NAME);

// Email verification token duration
export const EMAIL_VERIFICATION_TOKEN_DURATION = parseDuration(process.env.URU_WEB_2_FINAL_PROJECT_EMAIL_VERIFICATION_TOKEN_DURATION)

// Password reset token duration
export const RESET_PASSWORD_TOKEN_DURATION = parseDuration(process.env.URU_WEB_2_FINAL_PROJECT_RESET_PASSWORD_TOKEN_DURATION)
