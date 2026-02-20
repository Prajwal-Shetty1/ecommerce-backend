import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";

//Placing Orders using COD(cash on delivery)
const placeOrder = async (req, res) => {
    try {
        const { item, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            userId, item, amount, address,
            paymentMethod: "COD", payment: false, date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        //To save it in DB
        await newOrder.save();
        //once order is placed the cart data is been cleared 
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "OrderPlaced!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

//Placing Orders using Stripe Method
const placeOrderStripe = async (req, res) => {

}

//Placing Orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}


//All orders data for admin Panel(users order list)
const allOrders = async (req, res) => {

}

//User order data for Frontend
const userOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId });

        //console.log("ORDERS FROM DB:", orders);

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//update Order status for Admin Panel
const updateStatus = async (req, res) => {

}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrder, updateStatus };