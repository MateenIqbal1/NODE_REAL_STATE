import express from 'express'
import {upload} from '../helpers/cloudinary.js'
import { handleImageUpload } from '../controllers/imageController.js'

const router = express.Router();

router.post('/upload', upload.array('images', 6), handleImageUpload);

export  {router};
