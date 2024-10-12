import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { testimonialModel } from '../../../DB/models/testimonialModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addTestimonial = async (req, res, next) => {    
    const {
        name,
        position,
        review,
        altImage,
    } = req.body
    if (!name || !position || !review || !altImage) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload testimonial image', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Testimonilas/${customId}`
    });
    const testimonialObj = {
        name,
        position,
        review,
        image: { secure_url, public_id, alt: altImage, customId },
    }
    const newTestimonial = await testimonialModel.create(testimonialObj)
    if (!newTestimonial) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', testimonial: newTestimonial })
}

export const editTestimonial = async (req, res, next) => {
    const { testimonialId } = req.params;
    const {
        name,
        position,
        review,
        altImage,
    } = req.body
    const testimonial = await testimonialModel.findById(testimonialId)
    if (!testimonial) {
        return next(new Error('no testimonial exist', { cause: 400 }))
    }
    let testimonial_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(testimonial.image.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Testimonilas/${testimonial.image.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Testimonilas/${customId}`
            })
        ])
        testimonial_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = testimonial.image.secure_url
        const public_id = testimonial.image.public_id
        const customId = testimonial.image.customId
        testimonial_Image = { secure_url, public_id, customId }
    }
    testimonial.name = name || testimonial.name
    testimonial.position = position || testimonial.position
    testimonial.review = review || testimonial.review
    if(altImage){
        testimonial.image = { ...testimonial_Image, alt: altImage }
    }
    else{
        testimonial.image = { ...testimonial_Image, alt: testimonial.image.alt }
    }

    const updatedTestimonial = await testimonial.save()
    if (!updatedTestimonial) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Testimonilas/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', testimonial: updatedTestimonial })
}

export const deleteTestimonial = async (req, res, next) => {
    const { testimonialId } = req.params;
    const deletedTestimonial = await testimonialModel.findByIdAndDelete(testimonialId)
    if (!deletedTestimonial) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedTestimonial.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Testimonilas/${deletedTestimonial.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const getTestimonial = async (req, res, next) => {
    const testimonials = await testimonialModel.find()
    return res.status(200).json({ message: 'Done', testimonials })
}