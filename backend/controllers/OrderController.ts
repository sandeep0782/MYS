import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";
import CartItems from "../models/CartItems";
import Order from "../models/Order"; // make sure this import is correct
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
import PDFDocument from "pdfkit";
import path from "path";
import { generateInvoicePDF } from "../utils/InvoiceTemplate";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY as string,
  key_secret: process.env.RAZORPAY_SECRET as string,
});

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    console.log("===== createOrUpdateOrder HIT =====");

    const userId = req.id;

    const {
      orderId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails,
    } = req.body;

    const cart = await CartItems.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return response(res, 400, "Cart is empty");
    }

    let order = await Order.findOne({ _id: orderId });

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
    } else {
      order = new Order({
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

    await order.save();

    if (paymentDetails) {
      await CartItems.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );
    }

    return response(res, 200, "Order created or updated successfully", order);
  } catch (error) {
    return response(res, 500, "Internal server error");
  }
};

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

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      //   .populate("items.product"); // populate products

      .populate({
        path: "items.product",
        model: "Product",
      });

    if (!order) {
      return response(res, 404, "Order not found");
    }

    return response(res, 200, "Order fetched successfully", order);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      })
      .lean();

    if (!order) {
      return response(res, 404, "Order not found");
    }
    return response(res, 200, "User Order fetched successfully", order);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};
import { razorpay as razorpayInstance } from "../utils/razorpay"; // adjust path if needed

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response
) => {
  try {
    // const { orderId } = req.body;
    const { orderId } = req.body || {};
    const order = await Order.findById(orderId);

    if (!order) {
      return response(res, 404, "Order not found");
    }
    const razorPayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order?._id.toString(),
    });
    return response(
      res,
      200,
      "Razor Pay Order and payment created successfully",
      { order: razorPayOrder }
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal server error, Please try again later");
  }
};

export const handleRazorPayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEHOOK_SECRET as string;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const paymentId = req.body.payload.payment.entity.id;
      const orderId = req.body.payload.payment.entity.order.id;

      await Order.findByIdAndUpdate(
        { "paymentDetails.razorpay_order_id": orderId },
        {
          paymentStatus: "complete",
          status: "processing",
          "paymentDetails.razorpay_payment_id": paymentId,
        },
        { new: true }
      );
      return response(res, 200, "Webhook processed successfully Signature");
    } else {
      return response(res, 400, "Invalid Signature");
    }
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal server error");
  }
};

export const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return response(res, 404, "Order not found");
    }

    await order.deleteOne();

    return response(res, 200, "Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    return response(res, 500, "Internal server error");
  }
};

export const generateInvoice = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("user", "name email");

  if (!order) return res.status(404).json({ message: "Order not found" });

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );
  doc.pipe(res);

  const invoiceData = {
    orderId: order._id.toString(),
    customerName: (order.user as any).name,
    customerEmail: (order.user as any).email,
    date: new Date(order?.createdAt || Date.now()).toLocaleDateString(),
    items: order.items.map((item: any) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.finalPrice,
    })),
    totalAmount: order.totalAmount,
  };

  generateInvoicePDF(doc, invoiceData); // ✅ now TS knows types
  doc.end();
};
