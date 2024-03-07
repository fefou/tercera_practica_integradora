import nodemailer from "nodemailer"

const transport = nodemailer.createTransport(
    {
        service: 'gmail',
        port: 587,
        auth:{
            user: "ffedecairo@gmail.com",
            pass: "jrzaydtmmyzuarxk"
        }
    }
)

export const enviarEmail=(to, subject, message)=>{
    return transport.sendMail({
        to, subject,
        html: message
    })
}