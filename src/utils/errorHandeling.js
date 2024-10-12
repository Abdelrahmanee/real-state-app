import cloudinary from "./cloudinaryConfigrations.js";

export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch(async (err) => {
            console.log(err);
            // if (req.imagePath) {
            //     await cloudinary.api.delete_resources_by_prefix(req.imagePath)
            //     await cloudinary.api.delete_folder(req.imagePath)
            //     req.imagePath = ''
            // }
            return res.status(500).json({ message:'catch Error',error:err.message})

        })
    }
}
export const globalResponse = (err, req, res, next) => {
    if (err) {
        if (req.validationErrorArr) {
            return res.status(err['cause'] || 400).json({ message: req.validationErrorArr[0] })
        }
        return res.status(err['cause'] || 500).json({ message: err.message })
    }
}