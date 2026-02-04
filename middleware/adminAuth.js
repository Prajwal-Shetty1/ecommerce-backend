import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    //read token directly from headers
    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized, Login Again!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Not Authorized" });
    }

    next(); // allow request

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default adminAuth;
