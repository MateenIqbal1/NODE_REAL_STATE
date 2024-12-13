import { imageUploadUtil } from '../helpers/cloudinary.js';

const handleImageUpload = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Upload each file to Cloudinary and collect the URLs
        const results = await Promise.all(
            req.files.map(async (file) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const url = "data:" + file.mimetype + ";base64," + b64;
                const result = await imageUploadUtil(url);
                return result.secure_url; // Return the secure URL
            })
        );

        // Respond with an array of URLs
        res.json({
            success: true,
            urls: results
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: 'Error occurred during image upload'
        });
    }
}

export { handleImageUpload };
