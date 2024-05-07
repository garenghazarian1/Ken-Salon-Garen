
import Employee from '../models/Employee.js';


export const checkEmployee = async (req, res, next) => {
    if (!req.user) {
        
        return res.status(401).json({ message: "Not authenticated" });
    }
console.log("USER",req.user);



    try {
        const employee = await Employee.findOne({ userInfo: req.user });
        if (!employee) {
            return res.status(403).json({ message: 'Access restricted to employees only' });
        }
        req.employee = employee;
        next();
    } catch (error) {
        console.error('Error verifying employee:', error);
        res.status(500).json({ message: 'Server error during employee verification' });
    }
};
