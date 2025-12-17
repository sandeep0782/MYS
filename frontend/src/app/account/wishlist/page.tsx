'use client'
import CartItems from '@/components/CartItems';
import NoData from '@/components/NoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/lib/Spinner';
import { ProductDetails } from '@/lib/types/type';
import { useAddToCartMutation } from '@/store/cartApi';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/store/wishlistApi';
import { removedFromWishlistAction } from '@/store/slice/wishlistSlice';
import { RootState } from '@/store/store';
import { Check, Heart, Loader2, ShoppingCart, Trash, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addToCart, setCart } from '@/store/slice/cartSlice';

const page = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCartMutation] = useAddToCartMutation()
  const wishlist = useSelector((state: RootState) => state.wishlist.items)
  const [removeFromWishlistMutation] = useRemoveFromWishlistMutation();
  const [isAddToCart, setIsAddToCart] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.items);
  const userId = useSelector((state: RootState) => state.user.user);
  const { data: wishlistData, isLoading } = useGetWishlistQuery(userId!, {
    skip: !userId, // skip if userId is undefined
  }); const [wishlistItems, setWishlistItems] = useState<ProductDetails[]>([])

  console.log(wishlistData)
  useEffect(() => {
    if (wishlistData?.success) {
      setWishlistItems(wishlistData.data.products || []);
    }

  }, [wishlistData])

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  }

  const handleAddToCart = async (productId: string) => {
    setIsAddToCart(true);
    try {
      const result = await addToCartMutation({
        productId,
        quantity: 1
      }).unwrap();
      if (result.success && result.data) {
        dispatch(addToCart(result.data))

        toast.success(result.message || 'Added to Cart Succesffully')
      } else {
        throw new Error(result.message || 'Failed to create Cart')
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || 'Something went wrong')
    }
    finally {
      setIsAddToCart(false)
    }
    // alert('Added to cart!');
  };


  const handleRemoveItem = async (productId: string) => {

    try {
      const result = await removeFromWishlistMutation(productId).unwrap();
      if (result.success && result.data) {
        dispatch(setCart(result.data))
        // dispatch(resetCheckout())
        // dispatch(clearCart())
        toast.success(result.success || 'Item Removed successfully')
      }

    } catch (error) {
      toast.error('Failed to Remove cart ')
    }
  }

  const toggleWishlist = async (productId: string) => {
    try {
      const isWishlist = isInWishlist(productId);

      if (isWishlist) {
        const result = await removeFromWishlistMutation(productId).unwrap();
        if (result.success) {
          setWishlistItems(prev => prev.filter(item => item._id !== productId));
          dispatch(removedFromWishlistAction(productId));
          toast.success(result.message || 'Removed from Wishlist');
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };


  const isItemInCart = (productId: string) => {
    return cart.some((cartItem) => cartItem.product._id === productId)
  }

  if (isLoading)
    return <Spinner />

  if (!wishlistItems.length) {
    return (
      <NoData
        message='Your Wishlist is Empty'
        description='Looks like you have not added any item to your wishlist, browse  ut collection'
        buttonText='Browse Books'
        imageUrl='/images/wishlist.webp'
        onClick={() => router.push("/books")}
      />
    )
  }
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-2'>
        <Heart className='h-6 w-6 text-red-600' />
        <h3 className='text-2xl font-bold'>My Wishlist</h3>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {wishlistItems.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>₹ {item.finalPrice.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <img className='aspect-square w-full object-cover'
                src={item.images[0] as unknown as string}
                alt={item.name}
              />
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => toggleWishlist(item._id)}
              >
                <Trash2 />
              </Button>
              {isItemInCart(item._id) ? (
                <Button disabled className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  Item in Cart
                </Button>

              ) : (
                <Button className='w-60 py-6 bg-blue-700' onClick={() => handleAddToCart(item?._id)} disabled={isAddToCart}>
                  {isAddToCart ? (
                    <>
                      <Loader2 className='animate-spin mr-2' size={20} />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className='mr-2 h-5 w-5' />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div >
  );

}

export default page