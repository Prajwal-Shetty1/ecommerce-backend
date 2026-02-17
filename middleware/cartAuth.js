import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again!" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN DECODE:", token_decode);

    // 🔴 IMPORTANT FIX
    req.userId = token_decode._id || token_decode.id;

    console.log("USER ID:", req.userId);

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
