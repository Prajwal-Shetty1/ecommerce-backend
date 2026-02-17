
import express from "express";
import {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrder,updateStatus} from "../controllers/orderControllers";
import adminAuth from "../middleware/adminAuth";
import authUser from "../middleware/cartAuth";


const orderRouter = express.Router();

//Admin Features
orderRouter.post('/list',adminAuth,allOrders);
orderRouter.post('/status',adminAuth,updateStatus);

//Payment Features
orderRouter.post('/place',authUser,placeOrder);
orderRouter.post('/stripe',authUser,placeOrderStripe);
orderRouter.post('/razorpay',authUser,placeOrderRazorpay);

//User Features (to showcase orders in frontend)
orderRouter.post('/userOrders',authUser,userOrder);

export default orderRouter;