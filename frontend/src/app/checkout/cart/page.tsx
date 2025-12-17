"use client";
import CartItem from "@/components/CartItems";
import CheckoutAddress from "@/components/CheckoutAddress";
import NoData from "@/components/NoData";
import PriceDetails from "@/components/PriceDetails";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/lib/Spinner";
import { Address } from "@/lib/types/type";
import { cartApi, useAddToCartMutation, useGetCartQuery, useRemoveFromCartMutation } from "@/store/cartApi";
import { useCreateOrUpdateOrderMutation, useCreateRazorpayPaymentMutation, useGetOrderByIdQuery } from "@/store/orderAPi";

import { clearCart, setCart } from "@/store/slice/cartSlice";
import {
  resetCheckout,
  setCheckoutStep,
  setOrderId,
} from "@/store/slice/checkoutSlice";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import {
  addToWishlistAction,
  removedFromWishlistAction,
} from "@/store/slice/wishlistSlice";
import { persistor, RootState } from "@/store/store";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "@/store/wishlistApi";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery({}, { skip: true });
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || ""
  );
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const orderIdi = useSelector((state: RootState) => state.checkout.orderId);

  const [addToCart] = useAddToCartMutation(); // ✅ Add this line

  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
      // dispatch(clearCart());
      //         dispatch(resetCheckout());
    }
  }, [cartData, dispatch]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation({ productId }).unwrap();
      if (result.success && result.data) {
        dispatch(setCart(result.data));
        // dispatch(resetCheckout())
        // dispatch(clearCart())
        toast.success(result.success || "Item Removed successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to Remove cart ");
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId)
      );

      if (isWishlist) {
        const result = await removeFromWishlistMutation(productId).unwrap();
        dispatch(removedFromWishlistAction(productId));
        if (result.success) {
          toast.success(result.message || "Removed from Wishlist");
        } else {
          throw new Error(result.error || "Failed to remove from Wislist");
        }
      } else {
        const result = await addToWishlistMutation({ productId }).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(result.message || "Added to Wishlist");
        } else {
          throw new Error(result.error || "Failed to add to error");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || "Something went wrong");
    }
  };

  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const result = await addToCart({
        productId,
        quantity: newQty,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(setCart(result.data));
        toast.success("Cart updated");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0
  );
  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalOriginalAmount - totalAmount;
  // const shippingCharge = cart.items.map((item) => item.product.shippingCharges.toLowerCase() == 'free' ? 0 : parseFloat(item.product.shippingCharges) || 0);
  const shippingCharge = cart.items
    .filter((item) => item?.product?.shippingCharges)
    .map((item) => {
      const shipping = item.product.shippingCharges;
      if (typeof shipping === "string") {
        return shipping.toLowerCase() === "free"
          ? 0
          : parseFloat(shipping) || 0;
      }
      return parseFloat(shipping) || 0;
    });

  const maximumShippingCharges = Math.max(...shippingCharge, 0);

  const finalAmount = totalAmount + maximumShippingCharges;

  const handleProceedToCheckout = async () => {
    if (step === "cart") {
      try {
        const result = await createOrUpdateOrder({
          // updates: {
          items: cart.items,
          totalAmount: finalAmount,
          shippingAddress: selectedAddress?._id, // Send ObjectId if exists
          // },
        }).unwrap();
        if (result.success) {
          toast.success("Order created successfully");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast.error("Failed to create order");
      }
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
    if (orderId) {
      try {
        await createOrUpdateOrder({
          // updates: { 
          orderId, shippingAddress: address
          //  },
        }).unwrap();
        toast.success("Address updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update address");
      }
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("No order found, please try adding item and the try");
      return;
    }
    setIsProcessing(true);
    try {
      const { data, error } = await createRazorpayPayment({ orderId });

      if (!data || !data.data || !data.data.order) {
        throw new Error("Invalid payment data received from server");
      }
      const razorpayOrder = data?.data?.order;
      const options = {
        key: "rzp_test_78N43t3YczV2lT",
        // key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "MYSMMEE",
        description: "ECOM SERVICES",
        order_id: razorpayOrder.id,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const result = await createOrUpdateOrder({
              // updates: {
              orderId,
              paymentDetails: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              paymentStatus: "complete", // <-- Add this

              // },
            }).unwrap();

            if (result.success) {
              dispatch(clearCart());
              dispatch(resetCheckout());
              dispatch(cartApi.util.resetApiState());     // clear RTK Query cache

              await persistor.flush(); // Wait for any pending writes to complete

              toast.success("Payment Successfull !");
              router.push(`/checkout/payment-success?orderId=${orderId}`);
            } else {
              throw new Error(result.message);
            }
          } catch (error) {
            console.log("failed to update order", error);
            toast.error("payment Successfull but failed to update order");
          }
        },
        prefill: {
          name: orderData?.data?.user?.name,
          email: orderData?.data?.user?.email,
          contact: orderData?.data?.user?.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment. Please try again");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <NoData
        message="Please log in to access"
        description="You need to be logged in to access the required page"
        buttonText="Login"
        imageUrl="/images/login.png"
        onClick={handleOpenLogin}
      />
    );
  }
  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your Cart is Empty"
        description="Looks like you haven't added any item yet. explore our collection"
        buttonText="Browse"
        imageUrl="/images/cart.png"
        onClick={() => router.push("/products")}
      />
    );
  }

  if (isCartLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="min-h-screen bg-white">
        <div className="bg-red-200 py-4 px-6 mb-8">
          <div className="container mx-auto flex items-center ">
            <ShoppingCart className="h-6 w-6 mr-2 text-gray-600" />
            <span className="text-lg font-semibold text-gray-800">
              {cart.items.length}
              {cart.items.length === 1 ? " Item" : " Items"} in your cart
            </span>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {/* Cart Step */}
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "cart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Cart</span>
              </div>

              {/* Chevron */}
              <ChevronRight className="h-5 w-5 text-gray-400" />

              {/* Address Step */}
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "address"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Address</span>
              </div>

              {/* Chevron */}
              <ChevronRight className="h-5 w-5 text-gray-400" />

              {/* Payment Step */}
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "payment"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Payment</span>
              </div>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl">Order Summary</CardTitle>
                  <CardDescription>Review Your Items</CardDescription>
                </CardHeader>
                <CardContent>
                  <CartItem
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWishlist}
                    onUpdateQuantity={handleUpdateQuantity} // ✅ Pass this
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="">
              <PriceDetails
                totalOriginalAmount={totalOriginalAmount}
                totalAmount={finalAmount}
                shippingCharge={maximumShippingCharges}
                totalDiscount={totalDiscount}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address")
                  )
                }
              />
              {selectedAddress && (
                <Card className="mt-6 mb-6 shadow-lg">
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p>{selectedAddress?.state}</p>
                      {selectedAddress?.addressLine2 && (
                        <p>{selectedAddress?.addressLine2}</p>
                      )}
                      <p>
                        {selectedAddress?.city},{selectedAddress.state}{" "}
                        {selectedAddress?.pin}
                      </p>
                      <p>{selectedAddress.phoneNumber}</p>
                    </div>
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => setShowAddressDialog(true)}
                    >
                      <MapPin className="h-4 w-4 mr-2" /> Change Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select or Add Delivery Address</DialogTitle>
              </DialogHeader>
              <CheckoutAddress
                onAddressSelect={handleSelectAddress}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Page;
