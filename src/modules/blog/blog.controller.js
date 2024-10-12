import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { blogModel } from '../../../DB/models/blogModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addBlog = async (req, res, next) => {
    const {
        title,
        date,
        description,
        altImage,
    } = req.body
    
    if (!title || !date || !description || !altImage) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload blog image', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Blogs/${customId}`
    });
    const blogObj = {
        title,
        date,
        description,
        image: { secure_url, public_id, alt: altImage, customId },
    }
    const newBlog = await blogModel.create(blogObj)
    if (!newBlog) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', blog: newBlog })
}


export const editBlog = async (req, res, next) => {
    const { blogId } = req.params;
    const {
        title,
        date,
        description,
        altImage,
    } = req.body
    const blog = await blogModel.findById(blogId)
    if (!blog) {
        return next(new Error('no blog exist', { cause: 400 }))
    }

    let blog_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(blog.image.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Blogs/${blog.image.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Blogs/${customId}`
            })
        ])
        blog_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = blog.image.secure_url
        const public_id = blog.image.public_id
        const customId = blog.image.customId
        blog_Image = { secure_url, public_id, customId }
    }
    blog.title = title || blog.title
    blog.date = date || blog.date
    blog.description = description || blog.description
    if(altImage){
        blog.image = { ...blog_Image, alt: altImage }
    }
    else{
        blog.image = { ...blog_Image, alt:  blog.image.alt }
    }

    const updatedBlog = await blog.save()
    if (!updatedBlog) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Blogs/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', blog: updatedBlog })
}

export const deleteBlog = async (req, res, next) => {
    const { blogId } = req.params;
    const deletedBlog = await blogModel.findByIdAndDelete(blogId)
    if (!deletedBlog) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedBlog.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Blogs/${deletedBlog.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const getBlogs = async (req, res, next) => {
    const blogs = await blogModel.find()
    return res.status(200).json({ message: 'Done', blogs })
}