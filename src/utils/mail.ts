import nodemailer from "nodemailer";
import { MailProps } from "src/@types";

import props from "src/properties";

export function sendMail(data: MailProps) {
    let transporter = nodemailer.createTransport({
        host: props.smtp.host,
        port: props.smtp.port,
        secure: props.smtp.useTLS,
        auth: {
            user: props.smtp.user,
            pass: props.smtp.pass,
        },
    });
    transporter
        .sendMail({
            from: '"Benjamin" <benjamin@talentql.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        }).then(_ => {})
        .catch(console.error);

}