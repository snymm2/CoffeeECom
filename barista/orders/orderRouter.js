const express = require("express");

const { validateOrder, METHODS } = require("./orderValidation");
const { sendError } = require("../helpers")

const publicOrder = (order) => {
    if (!order) return;
    const result = { ...order, id: String(order._id) };
    delete result._id;
    return result;
};

function createOrderRouter(db) {

    const orderRouter = express.Router();
    
    orderRouter.post("/", async (req, res, next) => {
        try {
            const check = validateOrder(req.body);
            if (!check.valid) {
                return sendError(res, 400, "Invalid Order", check.errors)
            }
    
            const { customer, items, paymentMethod } = req.body;
    
            if (!METHODS.includes(paymentMethod)) {
                return sendError(res, 400, 'Invalid payment method.');
            }
    
            const order = await db.createOrder({customer, items, paymentMethod});
    
            return res.status(201).json({
                message: 'Order created successfully.',
                order: publicOrder(order)
            })
        } catch (error) {
            next(error)
        }
    });
    
    orderRouter.post("/:id/mock-payment", async (req, res, next) => {
        try {
    
            const { id } = req.params;
            const { outcome } = req.body ?? {};
    
            if (!["success", "failure"].includes(req.body?.outcome)) {
                return sendError(res, 400, "Outcome must be 'success' or 'failure'");
            }
    
            const order = await db.completeMockPayment(id, outcome);
            if (!order) {
                return sendError(res, 404, "Order not found or invalid order ID.")
            }
    
            const failed = outcome === 'failure';
    
            res.status(200).json({ 
                message: failed 
                    ? "Mock payment failed; stock released." 
                    : "Mock payment succeeded.",
                order: publicOrder(order)
            });
        } catch (err) {
            next(err);
        }
    });
    
    orderRouter.post("/:id/confirm-cod", async (req, res, next) => {
        try {
            const order = await db.confirmCashOnDelivery(req.params.id)
    
            if (!order) {
                return sendError(res, 404, "COD Order not found or already processed.");
            }
    
            res.status(200).json({message: "COD Order Confirmed", order: publicOrder(order)});
        } catch (error) {
            next(error);
        }
    })
    
    orderRouter.get("/:id", async (req, res, next) => {
        try {
            const order = await db.getOrderById(req.params.id);
            if (!order) {
                return sendError(res, 404, "Order not found.");
            }
            res.status(200).json({ order: publicOrder(order) });
        } catch (error) {
            next(error);
        }
    })

    return orderRouter;
}

module.exports = createOrderRouter;