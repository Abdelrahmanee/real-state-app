import { contactUsModel } from "../../../DB/models/contactUsModel.js"
import { sendEmailService } from "../../services/sendEmail.js"
import { emailTemplateCompany } from './../../utils/emailTemplate.js';

export const contact = async (req, res, next) => {
    const { 
        name, 
        email, 
        phoneNum, 
        message, 
    } = req.body    
    const contactUsObj = 
    {  
        name, 
        email, 
        phoneNum, 
        message, 
    }
    const contactInfo = await contactUsModel.create(contactUsObj)
    if(!contactInfo){
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', contactInfo })
}

export const getContactUsers = async (req,res,next)=>{
    const ContactedUsers = await contactUsModel.find().sort({ createdAt: -1 });
    if(!ContactedUsers){
        return next(new Error('fail to get users',{cause:400}))
    }
    res.status(200).json({ message: 'Done', ContactedUsers })

}