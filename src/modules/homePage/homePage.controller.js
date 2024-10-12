import { companyDataModel } from "../../../DB/models/companyDataModel.js"
import { heroImageModel } from "../../../DB/models/heroImagesModel.js"
import { testimonialModel } from './../../../DB/models/testimonialModel.js';
import { projectModel } from './../../../DB/models/projectModel.js';
import { blogModel } from '../../../DB/models/blogModel.js';
import { Types } from "mongoose";
import { aboutModel } from "../../../DB/models/aboutModel.js";
import { specializationModel } from './../../../DB/models/specializationModel.js';
import { clientModel } from './../../../DB/models/clientModel.js';

export const getHomeData = async (req, res, next) => {
  const [companyData, heroImages, about, specializations, testimonials, clients, projects, blogs] = await Promise.all([
    companyDataModel.findOne()
      .select('companyName email phoneNum address location metaDesc metaKeyWords Facebook Instagram Twitter WhatsApp logo.secure_url logo.alt'),

    heroImageModel.aggregate([
      {
        $project: {
          title: 1,
          type: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          }
        }
      }
    ]),

    aboutModel.findOne().select('titleHome description imageHome.secure_url imageHome.alt'),

    specializationModel.aggregate([
      {
        $project: {
          title: 1,
          description: 1,
          icon: {
            secure_url: "$icon.secure_url",
            alt: "$icon.alt"
          },
        }
      }
    ]),

    testimonialModel.aggregate([
      {
        $project: {
          name: 1,
          position: 1,
          review: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          }
        }
      }
    ]),

    clientModel.aggregate([
      {
        $project: {
          name: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          },
        }
      }
    ]),

    projectModel.aggregate([
      {
        $project: {
          name: 1,
          location: 1,
          mainImage: {
            secure_url: "$mainImage.secure_url",
            alt: "$mainImage.alt"
          }
        }
      }
    ]),

    blogModel.aggregate([
      {
        $project: {
          title: 1,
          image: 1,
          date: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          },
          description: {
            $reduce: {
              input: { $split: ["$description", " "] }, // Split the description into words
              initialValue: "",
              in: {
                $cond: [
                  { $lte: [{ $size: { $split: ["$$value", " "] } }, 30] }, // Limit to 30 words
                  { $concat: ["$$value", " ", "$$this"] },
                  "$$value"
                ]
              }
            }
          }
        }
      }
    ]),

  ])
  if (!companyData) {
    return next(new Error('no company data found', { cause: 400 }))
  }
  const homeData = {
    companyData,
    heroImages,
    about,
    specializations,
    testimonials,
    projects,
    clients,
    blogs
  }
  res.status(200).json({ message: 'Done', homeData })
}

export const getProjects = async (req, res, next) => {
  const [companyData, projects] = await Promise.all([
    companyDataModel.findOne()
      .select('companyName email phoneNum address location metaDesc metaKeyWords Facebook Instagram Twitter WhatsApp logo.secure_url logo.alt'),

    projectModel.find().select('name location mainImage.secure_url mainImage.alt clientId').populate([
      {
        path: 'clientId',
        select: 'name image.secure_url image.alt'
      },
    ])
  ])

  if (!companyData) {
    return next(new Error('no company data found', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', companyData, projects })
}

export const getBlogs = async (req, res, next) => {
  const [companyData, blogs] = await Promise.all([
    companyDataModel.findOne()
      .select('companyName email phoneNum address location metaDesc metaKeyWords Facebook Instagram Twitter WhatsApp logo.secure_url logo.alt'),

    blogModel.aggregate([
      {
        $project: {
          title: 1,
          image: 1,
          date: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          },
          description: {
            $reduce: {
              input: { $split: ["$description", " "] }, // Split the description into words
              initialValue: "",
              in: {
                $cond: [
                  { $lte: [{ $size: { $split: ["$$value", " "] } }, 30] }, // Limit to 30 words
                  { $concat: ["$$value", " ", "$$this"] },
                  "$$value"
                ]
              }
            }
          }
        }
      }
    ]),
  ])

  if (!companyData) {
    return next(new Error('no company data found', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', companyData, blogs })
}

export const getProject = async (req, res, next) => {
  const { projectId } = req.params
  const project = await projectModel.findById(projectId)
    .select('name location date clientId status details mainImage.secure_url mainImage.alt')
    .populate([
      {
        path: 'images',
        select: 'image.secure_url image.alt -projectId'
      },
      {
        path: 'clientId',
        select: 'name image.secure_url image.alt'
      }
    ])

  res.status(200).json({ message: 'Done', project })
}

export const getBlog = async (req, res, next) => {
  const { blogId } = req.params
  const blog = await blogModel.findById(blogId)
    .select('title date description image.secure_url image.alt')
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.status(200).json({ message: 'Done', blog })
}

export const getAboutData = async (req, res, next) => {
  const [companyData, about, specializations, clients, testimonials] = await Promise.all([
    companyDataModel.findOne()
      .select('companyName email phoneNum address location metaDesc metaKeyWords Facebook Instagram Twitter WhatsApp logo.secure_url logo.alt'),

    aboutModel.findOne().select('titleAbout mission vision imageAbout.secure_url imageAbout.alt'),

    specializationModel.aggregate([
      {
        $project: {
          title: 1,
          description: 1,
          icon: {
            secure_url: "$icon.secure_url",
            alt: "$icon.alt"
          },
        }
      }
    ]),

    clientModel.aggregate([
      {
        $project: {
          name: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          },
        }
      }
    ]),

    testimonialModel.aggregate([
      {
        $project: {
          name: 1,
          position: 1,
          image: {
            secure_url: "$image.secure_url",
            alt: "$image.alt"
          }
        }
      }
    ]),
  ])

  const aboutData = {
    companyData,
    about,
    specializations,
    clients,
    testimonials
  }
  res.status(200).json({ message: 'Done', aboutData })

}

export const getClientProjects = async (req, res, next) => {
  const { clientId } = req.params
  const projects = await projectModel.find({ clientId }).select('name location mainImage.secure_url mainImage.alt')
  res.status(200).json({ message: 'Done', projects })
}