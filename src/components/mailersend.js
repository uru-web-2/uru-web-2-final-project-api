import {EmailParams, MailerSend, Recipient, Sender} from "mailersend";
import parseDuration from "parse-duration"

// Email verification token duration
export const EMAIL_VERIFICATION_TOKEN_DURATION = parseDuration(process.env.URU_WEB_2_FINAL_PROJECT_EMAIL_VERIFICATION_TOKEN_DURATION)

// MailerSend client
const MAILER_SEND = new MailerSend({
  apiKey: process.env.URU_WEB_2_FINAL_PROJECT_MAILER_SEND_API_KEY,
});

// Email sender
const MAILER_SEND_SENT_FROM = new Sender(`noreply@${process.env.URU_WEB_2_FINAL_PROJECT_MAILER_SEND_DOMAIN}`, "UBOOK");

// Email footer
const FOOTER_HTML = `
<p>Best regards,</p>
<p>UBOOK Team</p>
`

const FOOTER_TEXT = `
Best regards,
UBOOK Team
`

// Template for welcome email
const WELCOME_SUBJECT = "Welcome to UBOOK!"

const WELCOME_HTML = (name) => {
    return `
<h1>Hi ${name},</h1>
<p>Welcome to UBOOK! We are glad to have you on board.</p>
${FOOTER_HTML}
`
}

const WELCOME_TEXT = (name) => {
    return `
Hi ${name},
Welcome to UBOOK! We are glad to have you on board.
${FOOTER_TEXT}
`
}

// Template for email verification
const VERIFY_EMAIL_SUBJECT = "Verify your email address"

const VERIFY_EMAIL_HTML = (name, link) => {
        return `
<h1>Hi ${name},</h1>
<p>Click the link below to verify your email address.</p>
<a href="${link}">Verify Email</a>
${FOOTER_HTML}
`
}

const VERIFY_EMAIL_TEXT = (name, link) => {
    return `
Hi ${name},
Click the link below to verify your email address.
${link}
${FOOTER_TEXT}
`
}

// Template for password reset
const RESET_PASSWORD_SUBJECT = "Reset your password"

const RESET_PASSWORD_HTML = (name, link) => {
    return `
<h1>Hi ${name},</h1>
<p>Click the link below to reset your password.</p>
<a href="${link}">Reset Password</a>
${FOOTER_HTML}
`
}

const RESET_PASSWORD_TEXT = (name, link) => {
    return `
Hi ${name},
Click the link below to reset your password.
${link}
${FOOTER_TEXT}
`
}

// Send welcome email
export async function sendWelcomeEmail(email, name) {
    const emailParams = new EmailParams()
        .setFrom(MAILER_SEND_SENT_FROM)
        .setTo([new Recipient(email, name)])
        .setSubject(WELCOME_SUBJECT)
        .setHtml(WELCOME_HTML(name))
        .setText(WELCOME_TEXT(name));

    return MAILER_SEND.email
        .send(emailParams)
}

// Send email verification
export async function sendVerificationEmail(email, name, token) {
    const link = `${process.env.URU_WEB_2_FINAL_PROJECT_VERIFY_EMAIL_URL}/${token}`

    const emailParams = new EmailParams()
        .setFrom(MAILER_SEND_SENT_FROM)
        .setTo([new Recipient(email, name)])
        .setSubject(VERIFY_EMAIL_SUBJECT)
        .setHtml(VERIFY_EMAIL_HTML(name, link))
        .setText(VERIFY_EMAIL_TEXT(name, link));

    return MAILER_SEND.email
        .send(emailParams)
}

// Send password reset
export async function sendResetPassword(email, name, token) {
    const link = `${process.env.URU_WEB_2_FINAL_PROJECT_RESET_PASSWORD_URL}/${token}`

    const emailParams = new EmailParams()
        .setFrom(MAILER_SEND_SENT_FROM)
        .setTo([new Recipient(email, name)])
        .setSubject(RESET_PASSWORD_SUBJECT)
        .setHtml(RESET_PASSWORD_HTML(name, link))
        .setText(RESET_PASSWORD_TEXT(name, link));

    return MAILER_SEND.email
        .send(emailParams)
}