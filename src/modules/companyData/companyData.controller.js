import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { companyDataModel } from './../../../DB/models/companyDataModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
  };

export const addCompanyData = async (req, res, next) => {
    const {
        companyName,
        email,
        phoneNum,
        address,
        location,
        Facebook,
        Instagram,
        Twitter,
        WhatsApp,
        altLogo,
        metaDesc,
        metaKeyWords,
    } = req.body
    if (!companyName || !phoneNum || !email || !address || !location || !altLogo) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }

    if (!req.file) {
        return next(new Error('Please upload company logo', { cause: 400 }));
    }
    const logoName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${logoName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/CompanyLogo/${customId}`
    });
    const companyObj = {
        companyName,
        email,
        phoneNum,
        logo: { secure_url, public_id, alt :altLogo ,customId},
        address,
        location,
        Facebook,
        Instagram,
        Twitter,
        WhatsApp,
        metaDesc,
        metaKeyWords,
    }
    const newCompany = await companyDataModel.create(companyObj)
    if (!newCompany) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', companyData:newCompany })
}


export const editCompanyData = async (req, res, next) => {
    const {
        companyName,
        email,
        phoneNum,
        address,
        location,
        Facebook,
        Instagram,
        Twitter,
        WhatsApp,
        altLogo,
        metaDesc,
        metaKeyWords,
    } = req.body
    const company = await companyDataModel.findOne()
    if (!company) {
        return next(new Error('no company exist', { cause: 400 }))
    }
    let Company_logo
    if (req.file) {
            const logoName = getFileNameWithoutExtension(req.file.originalname);
            const customId = `${logoName}_${nanoId()}`
            await cloudinary.uploader.destroy(company.logo.public_id)
            const [ deltedFolder, { secure_url, public_id }] =await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/CompanyLogo/${company.logo.customId}`),
                cloudinary.uploader.upload(req.file.path, {
                    folder: `${process.env.PROJECT_FOLDER}/CompanyLogo/${customId}`
                })
            ])
            Company_logo = { secure_url, public_id, customId}
    }
    else{
        const secure_url = company.logo.secure_url
        const public_id = company.logo.public_id
        const customId = company.logo.customId
        Company_logo = {secure_url,public_id,customId}
    }
    company.companyName = companyName || company.companyName
    company.email = email || company.email
    company.phoneNum = phoneNum || company.phoneNum
    company.address = address || company.address
    company.location = location || company.location
    company.Facebook = Facebook || company.Facebook
    company.Instagram = Instagram || company.Instagram
    company.Twitter = Twitter || company.Twitter
    company.WhatsApp = WhatsApp || company.WhatsApp
    company.metaDesc = metaDesc || company.metaDesc
    company.metaKeyWords = metaKeyWords || company.metaKeyWords
    if(altLogo){
        company.logo = { ...Company_logo, alt:altLogo }
    }
    else{
        company.logo = { ...Company_logo, alt: company.logo.alt } 
    }

    const updatedCompany = await company.save()
    if (!updatedCompany) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/CompanyLogo/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', companyData : updatedCompany })
}

export const getCompany = async (req, res, next) => {
    const company = await companyDataModel.findOne()
    if (!company) {
        return next(new Error('failed to get company data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', companyData:company })
}