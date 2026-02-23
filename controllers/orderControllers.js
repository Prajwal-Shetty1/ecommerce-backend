import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Stripe from 'stripe';

//Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//Global Variables
const currency = 'inr'
const deliveryCharge = 30

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
    try {
        const { item, amount, address } = req.body;
        const userId = req.userId;
        const { origin } = req.headers;
        const orderData = {
            userId, item, amount, address,
            paymentMethod: "Stripe", payment: false, date: Date.now()
        }
        const newOrder = new orderModel(orderData);
        //To save it in DB
        await newOrder.save();
        const line_items = item.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity,
        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: 'Delivery Charge' },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1,
        })
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            payment_method_types: ['card'],
            //successUrl-when payment success & cancelUrl-when payment fails redirected to cancel
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            mode: 'payment'
        })
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//Verify Stripe payment
const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    const userId = req.userId;
    try {
        if(success === "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//Placing Orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {

}


//All orders data for admin Panel(users order list)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

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
    try {
        const { orderId, status } = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json({ success: true, order })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrder, updateStatus ,verifyStripe};