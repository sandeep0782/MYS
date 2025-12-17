"use client";

import { CartItem } from "@/lib/types/type";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  wishlist: { products: string[] }[];
}

const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  onUpdateQuantity,
  wishlist,
}) => {
  return (
    <ScrollArea className="h-[450px] pr-4">
      <div className="space-y-6">
        {items.map((item) => {
          const isWishlisted = wishlist.some((w) =>
            w.products.includes(item.product._id)
          );

          const lineTotal = item.product.finalPrice * item.quantity;

          return (
            <div
              key={item._id}
              className="group relative rounded-2xl border border-gray-200 bg-white/70 backdrop-blur shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6 p-5">
                {/* Image */}
                <Link
                  href={`/products/${item.product._id}`}
                  className="relative h-40 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50"
                >
                  <Image
                    src={item.product.images?.[0]}
                    alt={item.product?.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw" // <-- add this line

                    className="object-contain p-3 transition-transform group-hover:scale-105"
                  />
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between">
                  {/* Top */}
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
                    >
                      {item.product.name}
                    </Link>

                    <p className="text-sm text-gray-500">
                      {item.product.shippingCharges === "free"
                        ? "🚚 Free Delivery"
                        : `🚚 Shipping ₹${item.product.shippingCharges}`}
                    </p>
                  </div>

                  {/* Middle */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity */}
                    <div className="flex items-center rounded-xl border bg-gray-50">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          onUpdateQuantity(item.product._id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="px-4 font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onUpdateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Pricing */}
                    <div className="text-right">
                      <p className="text-xs text-gray-400 line-through">
                        ₹{item.product.price}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{item.product.finalPrice}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-medium">₹{lineTotal}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => onToggleWishlist(item.product._id)}
                      className={`flex items-center gap-2 text-sm transition ${isWishlisted
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                        }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""
                          }`}
                      />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.product._id)}
                      className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Hover Accent */}
              <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-linear-to-r from-red-500 to-red-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default CartItems;
