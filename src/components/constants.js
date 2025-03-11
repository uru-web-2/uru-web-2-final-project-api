import DeepFreeze from "@ralvarezdev/js-deep-freeze";
import parseDuration from "parse-duration";

// Profiles names
export const PROFILES_NAME = DeepFreeze({
    GUEST: 'guest',
    STUDENT: 'student',
    TEACHER: 'teacher',
    LIBRARIAN: 'librarian',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super admin',
    DEVELOPER: 'developer'
});

// Email verification token duration
export const EMAIL_VERIFICATION_TOKEN_DURATION = parseDuration(process.env.URU_WEB_2_FINAL_PROJECT_EMAIL_VERIFICATION_TOKEN_DURATION)

// Password reset token duration
export const RESET_PASSWORD_TOKEN_DURATION = parseDuration(process.env.URU_WEB_2_FINAL_PROJECT_RESET_PASSWORD_TOKEN_DURATION)
