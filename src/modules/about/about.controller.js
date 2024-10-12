import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { aboutModel } from './../../../DB/models/aboutModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};


export const addAbout = async (req, res, next) => {
    const {
        titleHome,
        titleAbout,
        description,
        mission,
        vision,
        altHome,
        altAbout,

    } = req.body
    if (!titleHome || !description || !titleAbout || !mission || !vision || !altHome | !altAbout) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.files['imageHome']) {
        return next(new Error('Please upload image home', { cause: 400 }));
    }
    if (!req.files['imageAbout']) {
        return next(new Error('Please upload image about', { cause: 400 }));
    }
    const file1 = req.files['imageHome'][0];
    const file2 = req.files['imageAbout'][0];
    const ImageHomeName = getFileNameWithoutExtension(file1.originalname);
    const ImageAboutName = getFileNameWithoutExtension(file2.originalname);
    const customIdHome = `${ImageHomeName}_${nanoId()}`
    const customIdAbout = `${ImageAboutName}_${nanoId()}`
    const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['imageHome'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/About/${customIdHome}`
    });
    const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['imageAbout'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/About/${customIdAbout}`
    });


    const aboutObj = {
        titleHome,
        titleAbout,
        description,
        imageHome: { secure_url: secureUrl1, public_id: publicId1, customId: customIdHome, alt: altHome },
        imageAbout: { secure_url: secureUrl2, public_id: publicId2, customId: customIdAbout, alt: altAbout },
        mission,
        vision,
    }
    const newAbout = await aboutModel.create(aboutObj)
    if (!newAbout) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', about: newAbout })
}


export const editAbout = async (req, res, next) => {
    const {
        titleHome,
        titleAbout,
        description,
        mission,
        vision,
        altHome,
        altAbout,

    } = req.body
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('no about exist', { cause: 400 }))
    }
    let home_Image
    let about_Image
    if (req.files) {
        if (req.files['imageHome']) {
            const file1 = req.files['imageHome'][0];
            const ImageHomeName = getFileNameWithoutExtension(file1.originalname);
            const customIdHome = `${ImageHomeName}_${nanoId()}`

            await cloudinary.uploader.destroy(about.imageHome.public_id)
            const [deletedFolder, { secure_url: secureUrl1, public_id: publicId1 }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/About/${about.imageHome.customId}`),
                cloudinary.uploader.upload(req.files['imageHome'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/About/${customIdHome}`
                })
            ])
            home_Image = { secure_url: secureUrl1, public_id: publicId1, customId: customIdHome }
        }
        else {
            home_Image = about.imageHome
        }
        if (req.files['imageAbout']) {
            const file1 = req.files['imageAbout'][0];
            const ImageAboutName = getFileNameWithoutExtension(file1.originalname);
            const customIdAbout = `${ImageAboutName}_${nanoId()}`

            await cloudinary.uploader.destroy(about.imageAbout.public_id)
            const [deletedFolder, { secure_url: secureUrl1, public_id: publicId1 }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/About/${about.imageAbout.customId}`),
                cloudinary.uploader.upload(req.files['imageAbout'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/About/${customIdAbout}`
                })
            ])
           about_Image = { secure_url: secureUrl1, public_id: publicId1, customId: customIdAbout }
        }
        else {
            about_Image = about.imageAbout
        }
    }
    else {
        home_Image = about.imageHome
        about_Image = about.imageAbout

    }
    about.titleHome = titleHome || about.titleHome
    about.titleAbout = titleAbout || about.titleAbout
    about.description = description || about.description
    about.mission = mission || about.mission
    about.vision = vision || about.vision
    if (altHome) {
        about.imageHome = { ...home_Image, alt: altHome }
    }
    else {
        about.imageHome = { ...home_Image, alt: about.imageHome.alt }
    }

    if (altAbout) {
        about.imageAbout = { ...about_Image, alt: altAbout }
    }
    else {
        about.imageAbout = { ...about_Image, alt: about.imageAbout.alt }
    }

    const updatedAbout = await about.save()
    if (!updatedAbout) {
        await cloudinary.api.delete_resources([home_Image.public_id,about_Image.public_id])
        await Promise.all([
             cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/About/${home_Image.customId}`),
             cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/About/${about_Image.customId}`)
        ])
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', about: updatedAbout })
}


export const getAbout = async (req, res, next) => {
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('failed to get about data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', about })
}