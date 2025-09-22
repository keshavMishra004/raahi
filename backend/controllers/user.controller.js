import User from "../models/user.model.js"
import bcrypt from "bcrypt";

//signup
export async function signup(req, res) {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        fullname,
        email,
        password: hashedPassword,
    });
                                        
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
  
}

//login 
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
        return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
     console.error(err.message);
     res.status(500).json({ message: "Server Error" });
  }
}