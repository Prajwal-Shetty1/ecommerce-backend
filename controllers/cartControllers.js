import userModel from "../models/userModels.js";

// Add products to UserCart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    // ✅ safety check
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// Update User Cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    // ✅ safety check
    if (!cartData[itemId]) {
      return res.json({ success: false, message: "Item not in cart" });
    }

    if (quantity === 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated!" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



//Get User Cart Data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export { addToCart, updateCart, getUserCart }