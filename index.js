import express, { json } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve('./config/.env') })
import { dbConnection } from "./DB/connection.js";
import { globalResponse } from "./src/utils/errorHandeling.js";
import * as routers from './src/modules/index.routers.js';

const app = express()

const allowedOrigins = [''];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
};
app.use(cors());

app.get('/', (req, res) => { res.json({ message: "hello app" }) })
app.use(json())

app.use('/comapnyData',routers.companyDataRouter);
app.use('/heroImage',routers.heroImageRouter);
app.use('/testimonial',routers.testimonialRouter);
app.use('/project',routers.projectRouter);
app.use('/blog',routers.blogRouter);
app.use('/contact',routers.contactUsRouter);
app.use('/home',routers.homePageRouter);
app.use('/admin',routers.adminRouter);
app.use('/view',routers.viewRouter);
app.use('/about',routers.aboutRouter);
app.use('/specialization',routers.specializationRouter);
app.use('/client',routers.clientRouter);


app.all('*', (req, res, next) => {
    res.status(404).json({ message: '404 not found URL' })
})
app.use(globalResponse)

dbConnection()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



