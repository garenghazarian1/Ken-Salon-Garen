import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

dotenv.config();

const secret = crypto.randomBytes(64).toString('hex');
//console.log( "Secret Key: ", secret);

// REGISTER USER*********************************************** */
export const registerUser = async (req, res) => {
  console.log("Registering user...", req.body, req.file);
  
   try {
     const { name, email, phoneNumber, password, confirmPassword,  } = req.body;
     if (req.file) req.body.image = req.file.path;

     if (!password || !confirmPassword || password !== confirmPassword) {
         return res.status(400).json({ message: 'Passwords do not match or are missing' });
       }
       if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }

      // Validate phone number
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, 'AE'); // Assuming 'AE' (United Arab Emirates) as the default country
    if (!phoneNumberObj || !phoneNumberObj.isValid()) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(400).json({ message: 'User already exists' });
     }
     const hashedPassword = await bcrypt.hash(password, 12);
     //console.log("🚀 ~ registerUser ~ hashedPassword:", hashedPassword)
     const user = new User({
       name,
       email,
       phoneNumber,
       password: hashedPassword,
       image: req.file ? req.file.path : "",
     })
     await user.save();
     console.log("🚀 ~ registerUser ~ user:", user)
     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
     res.status(201).json({ user: { name: user.name, email: user.email, id: user._id, image: user.image }, token });
   } catch (error) {
     res.status(500).json({error: error.message, success: false, message: 'Something went wrong',  });
     console.log(error);
   }
   
};

// LOGIN USER*********************************************** */
export const loginUser = async (req, res) => {
  const { email, password, rememberMe  } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Wrong password" })
  }
  const expiresIn = rememberMe ? '30d' : '1d';
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
  res.status(200).send({ token, user });
}

// Google LOGIN USER*********************************************** */
export const googleLogin = async (req, res) => {

const {account,profile } =  req.body
console.log("🚀 ~ googleLogin ~ req:", req.body)

const { email,name, picture } = profile

const user = await User.findOne({ email });
if(!user) {

  const newUser = new User({
    name,
    email,
    password: 'google auth',
    image:picture
  })
  await newUser.save();

  const expiresIn = '30d'
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
  
  res.status(200).send({ token, user });
  console.log("🚀 ~ googleLogin ~ token:", token)
}

}


//  DELETE USER *********************************************** */
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const authUserId = req.user; // Use the authenticated user's ID from the token

  if (userId !== authUserId) {
    return res.status(403).json({ message: "You can only delete your own account!" });
  }

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// GET ALL USERS
// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({ role: 'user' }).select('-password'); // Fetch only 'user' role and exclude passwords
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error: error.message });
//   }
// };

// Updated getUsers function with search functionality
export const getUsers = async (req, res) => {
  const { search } = req.query; // Extract search query parameter
  const query = {
    role: 'user',
    ...(search && {
      name: { $regex: search, $options: 'i' }, // Case-insensitive regex search
    }),
  };

  try {
    const users = await User.find(query).select('-password'); // Apply search filter if 'search' param is provided
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      dateOfBirth,
      street,
      city,
      state,
      zipCode,
      authMethod
    } = req.body;

    // Find user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the logged-in user is the owner, admin, or the user themselves
    if (req.user.role !== 'admin' && req.user.role !== 'owner' && req.user !== user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.role = role || user.role;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.street = street || user.street;
    user.city = city || user.city;
    user.state = state || user.state;
    user.zipCode = zipCode || user.zipCode;
    user.authMethod = authMethod || user.authMethod;

    // Handle password update
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    // Handle image update
    if (req.file) {
      user.image = req.file.path;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        street: user.street,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        image: user.image,
        authMethod: user.authMethod,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message, message: 'Something went wrong' });
  }
};