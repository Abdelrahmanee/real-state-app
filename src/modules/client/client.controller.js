import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { clientModel } from '../../../DB/models/clientModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addClient = async (req, res, next) => {
    const {
        name,
        altImage,
    } = req.body
    
    if (!name || !altImage) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload client image', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Clients/${customId}`
    });
    const clientObj = {
        name,
        image: { secure_url, public_id, alt: altImage, customId },
    }
    const newClient = await clientModel.create(clientObj)
    if (!newClient) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', client: newClient })
}

export const editClient = async (req, res, next) => {
    const { clientId } = req.params;
    const {
        name,
        altImage,
    } = req.body
    const client = await clientModel.findById(clientId)
    if (!client) {
        return next(new Error('no client exist', { cause: 400 }))
    }

    let client_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(client.image.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Clients/${client.image.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Clients/${customId}`
            })
        ])
        client_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = client.image.secure_url
        const public_id = client.image.public_id
        const customId = client.image.customId
        client_Image = { secure_url, public_id, customId }
    }
    client.name = name || client.name
  
    if(altImage){
        client.image = { ...client_Image, alt: altImage }
    }
    else{
        client.image = { ...client_Image, alt:  client.image.alt }
    }

    const updatedClient = await client.save()
    if (!updatedClient) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Clients/${customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', client: updatedClient })
}

export const deleteClient = async (req, res, next) => {
    const { clientId } = req.params;
    const deletedClient = await clientModel.findByIdAndDelete(clientId)
    if (!deletedClient) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedClient.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Clients/${deletedClient.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const getClients = async (req, res, next) => {
    const clients = await clientModel.find()
    return res.status(200).json({ message: 'Done', clients })
}