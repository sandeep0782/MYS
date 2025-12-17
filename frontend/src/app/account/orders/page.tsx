

"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import NoData from "@/components/NoData";
import Spinner from "@/lib/Spinner";
import { useGetOrdersByUserQuery } from "@/store/orderAPi";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { Order } from "@/lib/types/type";

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        delivered: "bg-green-100 text-green-800",
        processing: "bg-yellow-100 text-yellow-800",
        shipped: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-800"
                }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const OrdersTablePage = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    const { data: orderData, isLoading } = useGetOrdersByUserQuery(user?._id || "");

    if (isLoading) return <Spinner />;

    const orders: Order[] = orderData?.data || [];

    if (!orders.length) {
        return (
            <NoData
                imageUrl="/images/no-book.jpg"
                message="No orders yet"
                description="Start exploring our book collection and place your first order."
                buttonText="Browse Books"
                onClick={() => router.push("/books")}
            />
        );
    }

    return (
        <div className="lg:ml-0 p-0 px-4 py-2">
            <div className="flex flex-col mb-4">
                <h2 className="text-2xl font-bold">My Orders</h2>
                <p className="text-gray-500 mt-1">View and manage your recent purchases</p>
                <hr className="border-gray-300 mt-3 w-full" />
            </div>

            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-left text-gray-700 uppercase text-sm font-bold border-b border-gray-300">
                            <th className="py-4 px-4">Order ID</th>
                            <th className="py-4 px-4">Date</th>
                            <th className="py-4 px-4">Description</th>
                            <th className="py-4 px-4">Items</th>
                            <th className="py-4 px-4">Total (₹)</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">Track</th>
                            <th className="py-4 px-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 font-mono text-sm">{order._id.slice(-6)}</td>
                                <td className="py-2 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4 text-sm" style={{ maxWidth: "200px", wordWrap: "break-word", whiteSpace: "normal" }}>
                                    {order.items.map((item) => `${item.product.name} (₹${item.product.finalPrice})`).join(", ")}
                                </td>
                                <td className="py-2 px-4 text-sm font-semibold">
                                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </td>
                                <td className="py-2 px-4 text-sm font-semibold">₹{order.totalAmount}</td>
                                <td className="py-2 px-4 text-sm">
                                    <StatusBadge status={order.status || ""} />
                                </td>
                                <td className="py-2 px-4 text-sm">
                                    <OrderDetailsDialog order={order} />
                                </td>
                                <td className="py-2 px-4 text-sm">
                                    {order.status === "delivered" && (
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
                                            onClick={() =>
                                                window.open(`http://localhost:8000/api/order/invoice/${order._id}`, "_blank")
                                            }
                                        >
                                            Download Invoice
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTablePage;
