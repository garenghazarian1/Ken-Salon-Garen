import express from 'express';
import { registerUser, loginUser, deleteUser, googleLogin, getUsers, updateUser  } from '../controllers/userController.js';
import authenticateToken  from "../middlewares/userMiddleware.js"
import uploadCloud from "../middlewares/multerCloudinary.js"

const router = express.Router();

router.post('/register', uploadCloud.single("logo"), registerUser);
router.post('/google/login', googleLogin);
router.post('/login', loginUser);
router.delete('/delete/:userId', authenticateToken, deleteUser);
router.get('/', getUsers);
router.put('/update/:id', authenticateToken, uploadCloud.single('image'), updateUser);

export default router;
