import multer from 'multer'
import { allowedExtensions } from './../utils/allowedEtensions.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const multerCloudFunction = (allowedExtensionsArr)=>{    
    if(!allowedExtensionsArr){
        allowedExtensionsArr = allowedExtensions.Image
    }
    const storage = multer.diskStorage({})
    const fileFilter = function(req,file,cb){
      const fileExtension = file.originalname.split('.').pop()     
        if(allowedExtensionsArr.includes(fileExtension.toLowerCase().replace('null',''))){
            return cb(null,true)
        }
        cb (new Error('invalid extension',{cause:400}),false)
    }
    const fileUpload = multer({storage,fileFilter})
    return fileUpload
}

// export const multerCloudFunction = ()=>{
//   const storage = multer.diskStorage({})
//   // const fileFilter = function(req,file,cb){
//   //     if(allowedExtensionsArr.includes(file.mimetype)){
//   //         return cb(null,true)
//   //     }
//   //     cb (new Error('invalid extension',{cause:400}),false)
//   // }
//   const fileUpload = multer({storage})
//   return fileUpload
// }




// const convertVideoToWebP = async (res,file) => {
//   const inputFilePath = file.path;
//   const outputFilePath = path.join(path.dirname(inputFilePath), `${path.parse(file.originalname).name}.webm`);
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputFilePath)
//       .output(outputFilePath)
//       .videoCodec('libvpx-vp9')
//       .outputOptions([
//         '-vf scale=640:-1',
//         '-b:v 1M',
//         '-r 30',
//         '-an',
//       ])
//       .on('end', () => {
//         file.path = outputFilePath;
//         file.mimetype = 'video/webp';
//         resolve();
//       })
//       .on('error', (err) => {
//         reject(new Error(`FFmpeg conversion failed: ${err.message}`));
//       })
//       .run();
//   });
  
// };


const convertImageToWebP = async (file) => {
  const inputFilePath = file.path;
  const outputFilePath = path.join(path.dirname(inputFilePath), `${path.parse(file.originalname).name}.webp`);
  try {
    await sharp(inputFilePath).toFile(outputFilePath);
    file.path = outputFilePath;
    file.mimetype = 'image/webp';
  } catch (error) {
    throw new Error(`WebP conversion failed: ${error.message}`);
  }
};

export const convertToWebP = async (req, res, next) => {
  try {
    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        await convertImageToWebP(req.file);
      }
      // else if (req.file.mimetype.startsWith('video/')) {
      //   await convertVideoToWebP(res,req.file);
      // }
    } 
    else if (req.files) {
      const fileFields = Object.keys(req.files);
      for (const fieldName of fileFields) {
        const file = req.files[fieldName]; 
        
        if (file.mimetype && file.mimetype.startsWith('image/')) {
          await convertImageToWebP(file);
        }
        // else if (file.mimetype.startsWith('video/')) {
        //   console.log("videooo");
        //   await convertVideoToWebP(res,file);
        // }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};


