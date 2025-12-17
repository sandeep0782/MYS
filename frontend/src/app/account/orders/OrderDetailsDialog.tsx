import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Order } from '@/lib/types/type'
import { CheckCircle, Eye, Package, Truck, XCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface OrderDetailsDialogProps {
    order: Order
}

interface StatusStepProps {
    title: string
    icon: React.ReactNode
    isCompleted: boolean
    isActive: boolean
    
}

const StatusStep = ({ title, icon, isCompleted, isActive }: StatusStepProps) => (
    <div
        className={`flex flex-col items-center ${isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-400'
            }`}
    >
        <div
            className={`rounded-full p-2 ${isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}
        >
            {icon}
        </div>
        <span className="text-xs mt-1 capitalize">{title}</span>
    </div>
)

const OrderDetailsDialog = ({ order }: OrderDetailsDialogProps) => {
    const getStatusIndex = (status: string) => {
        const statuses = ['processing', 'shipped', 'delivered', 'cancelled']
        return statuses.indexOf(status)
    }

    const statusIndex = getStatusIndex(order?.status)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Check Status 
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[800px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-700">Order Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-linear-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg text-purple-800 mb-2">Order Status</h3>
                        <div className="flex justify-between items-center">
                            <StatusStep
                                title="processing"
                                icon={<Package className="h-5 w-5" />}
                                isCompleted={statusIndex > 0}
                                isActive={statusIndex === 0}
                            />
                            <div className={`h-1 flex-1 ${statusIndex > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />

                            <StatusStep
                                title="shipped"
                                icon={<Truck className="h-5 w-5" />}
                                isCompleted={statusIndex > 1}
                                isActive={statusIndex === 1}
                            />
                            <div className={`h-1 flex-1 ${statusIndex > 1 ? 'bg-green-500' : 'bg-gray-300'}`} />

                            <StatusStep
                                title="delivered"
                                icon={<CheckCircle className="h-5 w-5" />}
                                isCompleted={statusIndex > 2}
                                isActive={statusIndex === 2}
                            />

                            {order?.status === 'cancelled' && (
                                <>
                                    <div className="h-1 flex-1 bg-red-500" />
                                    <StatusStep
                                        title="cancelled"
                                        icon={<XCircle className="h-5 w-5" />}
                                        isCompleted={true}
                                        isActive={true}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-linear-to-r from-blue-100 to-cyan-400 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg text-blue-800 mb-2">Items</h3>
                        <div className="space-y-4">
                            {order?.items?.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <Image
                                        src={item?.product?.images?.[0] || '/images/book-placeholder.png'}
                                        alt={item?.product?.name || 'Book Image'}
                                        height={60}
                                        width={60}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <p className="font-medium">{item?.product?.name}</p>
                                        <div className="flex gap-2 text-sm text-gray-700">
                                            <span>{item?.product?.description}</span>
                                            <span>({item?.product?.shortDescription})</span>
                                        </div>
                                        <p className="text-sm">Qty: {item?.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-linear-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                        <h3 className="font-serif text-lg text-green-800 mb-2">Shipping Address</h3>
                        <p>{order?.shippingAddress?.addressLine1}</p>
                        <p>
                            {order?.shippingAddress?.city}, {order?.shippingAddress?.state} -{' '}
                            {order?.shippingAddress?.pin}
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-linear-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
                        <h3 className="font-serif text-lg text-orange-800 mb-2">Payment Details</h3>
                        <p>Order ID: {order?.paymentDetails?.razorpay_order_id}</p>
                        <p>Payment ID: {order?.paymentDetails?.razorpay_payment_id}</p>
                        <p>Amount: ₹{order?.totalAmount}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderDetailsDialog
