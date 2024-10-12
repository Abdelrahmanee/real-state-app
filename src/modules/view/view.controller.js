import { visitorModel } from "../../../DB/models/visitorModel.js";
import { viewModel } from './../../../DB/models/viewModel.js';

export const newVisitor = async (req,res,next) =>{
    const {IP} = req.body
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); 
    const isVisitorExist = await visitorModel.findOne({
        IP,
        createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
        }
    });
    if(!isVisitorExist){
        const location = 'location';
        const newVisitor = await visitorModel.create({IP,location})
        if(!newVisitor){
            return next(new Error('creation failed', { cause: 400 }))
        }
        res.status(200).json({ message: 'Done', newVisitor })
    }
    else{
        res.status(200).json({ message: 'IP is already exist', visitor:isVisitorExist })
    }
}

//add view for project or whatever

export const newView = async (req,res,next) =>{
    const { projectId, visitorId } = req.body
    const view = await viewModel.create({ projectId, visitorId })
    res.status(200).json({ message: 'Done', view })
}

//get views

export const getAllViews = async (req,res,next) =>{
    const { projectId } = req.params
    const views = await viewModel.find({projectId})
    res.status(200).json({ message: 'Done', views })
}