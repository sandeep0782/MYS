"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = exports.deleteOrderById = exports.handleRazorPayWebhook = exports.createPaymentWithRazorpay = exports.getOrderByUser = exports.getOrderById = exports.createOrUpdateOrder = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const CartItems_1 = __importDefault(require("../models/CartItems"));
const Order_1 = __importDefault(require("../models/Order")); // make sure this import is correct
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const pdfkit_1 = __importDefault(require("pdfkit"));
const InvoiceTemplate_1 = require("../utils/InvoiceTemplate");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
const createOrUpdateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("===== createOrUpdateOrder HIT =====");
        const userId = req.id;
        const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails, } = req.body;
        const cart = yield CartItems_1.default.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Cart is empty");
        }
        let order = yield Order_1.default.findOne({ _id: orderId });
        if (order) {
            order.shippingAddress = shippingAddress || order.shippingAddress;
            order.paymentMethod = paymentMethod || order.paymentMethod;
            if (typeof totalAmount === "number") {
                order.totalAmount = totalAmount;
            }
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }
        }
        else {
            order = new Order_1.default({
                user: userId,
                items: cart.items,
                totalAmount,
                shippingAddress,
                paymentMethod,
                paymentDetails,
                paymentStatus: paymentDetails ? "complete" : "pending",
                status: paymentDetails ? "processing" : "pending",
            });
        }
        yield order.save();
        if (paymentDetails) {
            yield CartItems_1.default.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        }
        return (0, responseHandler_1.response)(res, 200, "Order created or updated successfully", order);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.createOrUpdateOrder = createOrUpdateOrder;
// export const createOrUpdateOrder = async (req: Request, res: Response) => {
//   try {
//     console.log("hittttt")
//     const userId = req.id;
//     const {
//       orderId,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//       paymentDetails,
//     } = req.body;
//     console.log("totalAmount", totalAmount);
//     const cart = await CartItems.findOne({ user: userId }).populate(
//       "items.product"
//     );
//     if (!cart || cart.items.length === 0) {
//       return response(res, 400, "Cart is empty");
//     }
//     let order = await Order.findOne({ _id: orderId });
//     if (order) {
//       // Update existing order
//       order.shippingAddress = shippingAddress || order.shippingAddress;
//       order.paymentMethod = paymentMethod || order.paymentMethod;
//       order.totalAmount = totalAmount || order.totalAmount;
//       if (paymentDetails) {
//         order.paymentDetails = paymentDetails;
//         order.paymentStatus = "complete";
//         order.status = "processing";
//       }
//     } else {
//       // Create new order
//       order = new Order({
//         user: userId,
//         items: cart.items,
//         totalAmount,
//         shippingAddress,
//         paymentMethod,
//         paymentDetails,
//         paymentStatus: paymentDetails ? "complete" : "pending",
//         status: paymentDetails ? "processing" : "pending",
//       });
//     }
//     await order.save();
//     if (paymentDetails) {
//       await CartItems.findOneAndUpdate(
//         { user: userId },
//         { $set: { items: [] } }
//       );
//     }
//     return response(res, 200, "Order created or updated successfully", order);
//   } catch (error) {
//     console.error("Error in createOrUpdateOrder:", error);
//     return response(res, 500, "Internal server error");
//   }
// };
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findById(req.params.id)
            .populate("user", "name email")
            .populate("shippingAddress")
            //   .populate("items.product"); // populate products
            .populate({
            path: "items.product",
            model: "Product",
        });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Order fetched successfully", order);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.getOrderById = getOrderById;
const getOrderByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const order = yield Order_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            model: "Product",
        })
            .lean();
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        return (0, responseHandler_1.response)(res, 200, "User Order fetched successfully", order);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.getOrderByUser = getOrderByUser;
const createPaymentWithRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { orderId } = req.body;
        const { orderId } = req.body || {};
        const order = yield Order_1.default.findById(orderId);
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        const razorPayOrder = yield razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order === null || order === void 0 ? void 0 : order._id.toString(),
        });
        return (0, responseHandler_1.response)(res, 200, "Razor Pay Order and payment created successfully", { order: razorPayOrder });
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error, Please try again later");
    }
});
exports.createPaymentWithRazorpay = createPaymentWithRazorpay;
const handleRazorPayWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = process.env.RAZORPAY_WEHOOK_SECRET;
        const shasum = crypto_1.default.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");
        if (digest === req.headers["x-razorpay-signature"]) {
            const paymentId = req.body.payload.payment.entity.id;
            const orderId = req.body.payload.payment.entity.order.id;
            yield Order_1.default.findByIdAndUpdate({ "paymentDetails.razorpay_order_id": orderId }, {
                paymentStatus: "complete",
                status: "processing",
                "paymentDetails.razorpay_payment_id": paymentId,
            }, { new: true });
            return (0, responseHandler_1.response)(res, 200, "Webhook processed successfully Signature");
        }
        else {
            return (0, responseHandler_1.response)(res, 400, "Invalid Signature");
        }
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.handleRazorPayWebhook = handleRazorPayWebhook;
const deleteOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield Order_1.default.findById(orderId);
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        yield order.deleteOne();
        return (0, responseHandler_1.response)(res, 200, "Order deleted successfully");
    }
    catch (error) {
        console.error("Error deleting order:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
});
exports.deleteOrderById = deleteOrderById;
const generateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(req.params.id)
        .populate("items.product")
        .populate("user", "name email");
    if (!order)
        return res.status(404).json({ message: "Order not found" });
    const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);
    doc.pipe(res);
    const invoiceData = {
        orderId: order._id.toString(),
        customerName: order.user.name,
        customerEmail: order.user.email,
        date: new Date((order === null || order === void 0 ? void 0 : order.createdAt) || Date.now()).toLocaleDateString(),
        items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.finalPrice,
        })),
        totalAmount: order.totalAmount,
    };
    (0, InvoiceTemplate_1.generateInvoicePDF)(doc, invoiceData); // ✅ now TS knows types
    doc.end();
});
exports.generateInvoice = generateInvoice;
