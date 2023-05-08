import "dotenv/config";

export default {
    HOST: process.env.HOST || "localhost:8080",
    PORT: parseInt(process.env.PORT as string, 10) || 8080,
    AAKASH_AUTH: process.env.AAKASH_AUTH || "",
    JWT_SECRET: process.env.JWT_SECRET || "",

    // email config
    MAIL_HOST: process.env.MAIL_HOST || "",
    MAIL_USER: process.env.MAIL_USER || "",
    MAIL_PASS: process.env.MAIL_PASS || "",
    MAIL_PORT: parseInt(process.env.MAIL_PORT as string, 10) || 587,
};
