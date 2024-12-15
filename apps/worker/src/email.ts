import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINTS,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail (to: string, body: string) {
    await transport.sendMail({
        from: "shyamindasenevirathna@gmail.com",
        sender: "shyamindasenevirathna@gmail.com",
        to,
        subject: "Hello from zapier",
        text: body
    })
}