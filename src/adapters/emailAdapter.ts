import nodemailer from 'nodemailer'
import "dotenv/config";

export const emailAdapter = {
    async send(user:any,subject:string, message:string) {
        let transporter = nodemailer.createTransport({
            host:"smtp.yandex.ru",
            port: 465,
            secure: true,
            auth: {
                user: "devliss@yandex.ru",//"devliss@yandex.ru",//process.env.SMTP_USER || "",
                pass: "9c4j3W54dh7JKUu" //process.env.SMTP_PASSWORD || ""
            }
        });

        try {
            let result = await transporter.sendMail({
                from: "devliss@yandex.ru",
                to: user.email,
                subject: subject,
                html: message
            })
            return result
        }catch(e){
            console.log(e)
        }

    }
}