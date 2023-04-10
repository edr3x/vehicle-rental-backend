import "dotenv/config";

export default {
    PORT: parseInt(process.env.PORT as string, 10) || 8080,
    AAKASH_AUTH: process.env.AAKASH_AUTH || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
};
