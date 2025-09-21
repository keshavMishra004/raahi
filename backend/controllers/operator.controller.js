import OperatorModel from "../models/operator.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Helper to generate JWT token for a user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '7d'});
};

export async function signup(req, res) {
    try {
        const {email, password} = req.body;

        // Trim inputs and validate
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
        if (!passwordRegex.test(trimmedPassword)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
        });
        }

        // Check if operator already exists
        const operatorExists = await OperatorModel.findOne({ email: trimmedEmail });
        if (operatorExists) {
        return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password and create operator
        const hashed = await bcrypt.hash(trimmedPassword, 10);
        const operator = await OperatorModel.create({
            email: trimmedEmail,
            password: hashed,
        });

        // Respond with operator info and JWT token
        res.status(201).json({
            _id: operator._id,
            email: operator.email,
            token: generateToken(operator._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find operator by email
        const operator = await OperatorModel.findOne({ email });
        if (!operator) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const match = await bcrypt.compare(password, operator.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Respond with operator info and JWT token
        res.json({
            _id: operator._id,
            email: operator.email,
            token: generateToken(operator._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
}
