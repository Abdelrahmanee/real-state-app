import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { heroImageModel } from './../../../DB/models/heroImagesModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addHeroImage = async (req, res, next) => {
    const {
        title,
        type,
        projectId,
        blogId,
        altImage,
    } = req.body
    if (!title || !type || !altImage) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload hero logo', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/HeroImages/${customId}`
    });
    const herImageObj = {
        title,
        type,
        projectId,
        blogId,
        image: { secure_url, public_id, alt: altImage, customId },
    }
    const newHeroImage = await heroImageModel.create(herImageObj)
    if (!newHeroImage) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', heroImage: newHeroImage })
}


export const editHeroImage = async (req, res, next) => {
    const { heroImageId } = req.params;
    const {
        title,
        type,
        projectId,
        blogId,
        altImage,
    } = req.body;
    console.log(req.body);
    const heroImage = await heroImageModel.findById(heroImageId)
    if (!heroImage) {
        return next(new Error('no Hero Image exist', { cause: 400 }))
    }
    let hero_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(heroImage.image.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/HeroImages/${heroImage.image.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/HeroImages/${customId}`
            })
        ])
        hero_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = heroImage.image.secure_url
        const public_id = heroImage.image.public_id
        const customId = heroImage.image.customId
        hero_Image = { secure_url, public_id, customId }
    }
    heroImage.title = title || heroImage.title
    heroImage.type = type || heroImage.type
    heroImage.projectId = projectId || heroImage.projectId
    heroImage.blogId = blogId || heroImage.blogId
    if(altImage){
        heroImage.image = { ...hero_Image, alt: altImage }
    }
    else{
        heroImage.image = { ...hero_Image, alt: heroImage.image.alt }
    }

    const updatedHeroImage = await heroImage.save()
    if (!updatedHeroImage) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/HeroImages/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', heroImage: updatedHeroImage })
}

export const deleteHeroImage = async (req, res, next) => {
    const { heroImageId } = req.params;
    const deletedHeroImage = await heroImageModel.findByIdAndDelete(heroImageId)
    if (!deletedHeroImage) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedHeroImage.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/HeroImages/${deletedHeroImage.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const getHeroImages = async (req, res, next) => {
    const heroImages = await heroImageModel.find()
    return res.status(200).json({ message: 'Done', heroImages })
}