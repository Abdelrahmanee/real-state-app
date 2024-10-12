import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { blogModel } from '../../../DB/models/blogModel.js';
import { specializationModel } from '../../../DB/models/specializationModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addSpecialization = async (req, res, next) => {
    const {
        title,
        description,
        altIcon,
    } = req.body
    
    if (!title || !description || !altIcon) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload specialization icon', { cause: 400 }));
    }
    const iconName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${iconName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Specializations/${customId}`
    });
    const specializationObj = {
        title,
        description,
        icon: { secure_url, public_id, alt: altIcon, customId },
    }
    const newSpecialization = await specializationModel.create(specializationObj)
    if (!newSpecialization) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', specialization: newSpecialization })
}

export const editSpecialization = async (req, res, next) => {
    const { specializationId } = req.params;
    const {
        title,
        description,
        altIcon,
    } = req.body
    const specialization = await specializationModel.findById(specializationId)
    if (!specialization) {
        return next(new Error('no specialization exist', { cause: 400 }))
    }

    let specialization_icon
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(specialization.icon.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Specializations/${specialization.icon.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Specializations/${customId}`
            })
        ])
        specialization_icon = { secure_url, public_id, customId }
    }
    else {
        const secure_url = specialization.icon.secure_url
        const public_id = specialization.icon.public_id
        const customId = specialization.icon.customId
        specialization_icon = { secure_url, public_id, customId }
    }
    specialization.title = title || specialization.title
    specialization.description = description || specialization.description
    if(altIcon){
        specialization.icon = { ...specialization_icon, alt: altIcon }
    }
    else{
        specialization.icon = { ...specialization_icon, alt:  specialization.icon.alt }
    }

    const updatedspecialization = await specialization.save()
    if (!updatedspecialization) {
        await cloudinary.uploader.destroy(specialization_icon.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Specializations/${specialization_icon.customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', specialization: updatedspecialization })
}

export const deleteSpecialization = async (req, res, next) => {
    const { specializationId } = req.params;
    const deletedSpecialization = await specializationModel.findByIdAndDelete(specializationId)
    if (!deletedSpecialization) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedSpecialization.icon.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Specializations/${deletedSpecialization.icon.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const getSpecializations = async (req, res, next) => {
    const specializations = await specializationModel.find()
    return res.status(200).json({ message: 'Done', specializations })
}