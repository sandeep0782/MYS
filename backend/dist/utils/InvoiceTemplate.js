"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
const generateInvoicePDF = (doc, data) => {
    // Header
    doc.fontSize(20).text("Tax Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${data.orderId}`);
    doc.text(`Customer: ${data.customerName}`);
    doc.text(`Email: ${data.customerEmail}`);
    doc.text(`Date: ${data.date}`);
    doc.moveDown();
    // Table
    doc.fontSize(14).text("Items", { underline: true });
    doc.moveDown(0.5);
    data.items.forEach((item, index) => {
        doc
            .fontSize(12)
            .text(`${index + 1}. ${item.name} - Qty: ${item.quantity} - Price: ₹${item.price}`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Total: ₹${data.totalAmount}`, { align: "right" });
};
exports.generateInvoicePDF = generateInvoicePDF;
