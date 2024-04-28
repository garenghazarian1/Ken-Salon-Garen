import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "Beauty Center",
    format: async (req, file) => {
      let extension = file.mimetype.includes("image")
        ? file.mimetype.slice(6)
        : "";
      return extension;
    },
    public_id: (req, file) => Date.now(),
  },
});

const uploadCloud = multer({ storage: storage });
export default uploadCloud;
