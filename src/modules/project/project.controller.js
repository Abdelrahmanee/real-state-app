import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { heroImageModel } from './../../../DB/models/heroImagesModel.js';
import { testimonialModel } from '../../../DB/models/testimonialModel.js';
import { projectModel } from '../../../DB/models/projectModel.js';
import { projectImageModel } from '../../../DB/models/projectImageModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addProject = async (req, res, next) => {
    const {
        name,
        date,
        clientId,
        status,
        location,
        details,
        altImage,
    } = req.body
    if (!name || !date || !clientId || !location || !details || !altImage) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload project image', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const projectFolder = `${name}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId}`
    });
    const projectObj = {
        name,
        date,
        clientId,
        status,
        location,
        details,
        mainImage: { secure_url, public_id, alt: altImage, customId },
        projectFolder
    }
    const newProject = await projectModel.create(projectObj)
    if (!newProject) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', project: newProject })
}

export const editProject = async (req, res, next) => {
    const { projectId } = req.params;
    const {
        name,
        date,
        clientId,
        status,
        location,
        details,
        altImage,
    } = req.body
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('no project exist', { cause: 400 }))
    }

    let projectFolder = project.projectFolder
    if (name) {
        projectFolder = `${name}_${nanoId()}`
    }
    let project_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(project.mainImage.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId}`
            })
        ])
        project_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = project.mainImage.secure_url
        const public_id = project.mainImage.public_id
        const customId = project.mainImage.customId
        project_Image = { secure_url, public_id, customId }
    }
    project.name = name || project.name
    project.date = date || project.date
    project.clientId = clientId || project.clientId
    project.status = status || project.status
    project.location = location || project.location
    project.details = details || project.details
    project.projectFolder = projectFolder
    if (altImage) {
        project.mainImage = { ...project_Image, alt: altImage }
    }
    else {
        project.mainImage = { ...project_Image, alt: project.mainImage.alt }
    }

    const updatedProject = await project.save()
    if (!updatedProject) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', project: updatedProject })
}

export const deleteProject = async (req, res, next) => {
    const { projectId } = req.params;
    const deletedProject = await projectModel.findByIdAndDelete(projectId)
    if (!deletedProject) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    const projectIMages = await projectImageModel.find({projectId})
    const projectImagesPublicIds = projectIMages.map(p=>p.image.public_id)
    const projectImagesIds = projectIMages.map(p=>p._id)
    if (projectImagesIds.length > 0) {
        const [deletedCloud, deletedDataBase ] =await Promise.all([
            cloudinary.api.delete_resources(projectImagesPublicIds),
            projectImageModel.deleteMany({ _id: { $in: projectImagesIds } })
        ])
        if(!deletedCloud || deletedDataBase.deletedCount <= 0){
        return next(new Error('failed to delete images', { cause: 400 }))
        }
    }
    const deletedMainImage = await cloudinary.uploader.destroy(deletedProject.mainImage.public_id)
    const deletedFolder = await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedProject.projectFolder}`)
    if(!deletedMainImage || !deletedFolder){
        return next(new Error('failed to delete main image and folder', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done' })
}

export const getProjects = async (req, res, next) => {
    const projects = await projectModel.find().populate([
        {
            path:'images',
            select:'-projectId image.secure_url image.alt'
        },
        {
            path:'clientId',
            select:'name image.secure_url image.alt'
        }
    ])
    return res.status(200).json({ message: 'Done', projects })
}

export const addProjectImages = async (req, res, next) => {
    const { projectId, altImage } = req.body;
    if (!projectId) {
        return next(new Error('project id is required', { cause: 400 }))
    }
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('no project found', { cause: 400 }))
    }
    if (!req.files || req.files.length === 0) {
        return next(new Error('Please upload at least one project image', { cause: 400 }));
    }
    const uploadPromises = req.files.map(async (file) => {
        const imageName = getFileNameWithoutExtension(file.originalname);
        const customId = `${imageName}_${nanoId()}`;
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}/${customId}`,
        });

        // Return the image data to be inserted later
        return {
            image: {
                secure_url,
                public_id,
                alt: altImage || imageName,
                customId,
            },
            projectId,
        };
    });
    const uploadedImagesData = await Promise.all(uploadPromises);
    const savedImages = await projectImageModel.insertMany(uploadedImagesData);
    
    res.status(200).json({ message: 'Done',projectImages: savedImages});
}

export const deleteProjectImage = async (req,res,next) =>{
    const { imageId } = req.params;
    const deletedImage = await projectImageModel.findByIdAndDelete(imageId).populate('projectId')
    if (!deletedImage) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedImage.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedImage.projectId.projectFolder}/${deletedImage.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}
