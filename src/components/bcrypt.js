// Load bcrypt salt rounds from environment variables
export const SALT_ROUNDS = parseInt(process.env.URU_WEB_2_FINAL_PROJECT_API_BCRYPT_SALT_ROUNDS) || 10