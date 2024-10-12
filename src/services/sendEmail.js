import nodemailer from 'nodemailer'
export async function sendEmailService({
    to,
    subject,
    message,
    attachments=[]
}={}){
    //configurations
    const transporter = nodemailer.createTransport({
        host:process.env.NODE_MAILER_HOST,
        port:465,
        secure:true,
        auth:{
            user:process.env.NODE_MAILER_USER,
            pass:process.env.NODE_MAILER_PASSWORD,
        }
    })
    const emailInfo = await transporter.sendMail({
        from:`<${process.env.NODE_MAILER_USER}>`,
        to : to ,
        subject : subject,
        html:message ,
        attachments
    })
    
    if(emailInfo.accepted){
        return true
    }
    else{
        return false
    }
}