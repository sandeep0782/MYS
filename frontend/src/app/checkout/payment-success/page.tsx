'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGetOrderByIdQuery } from '@/store/orderAPi';
import Spinner from '@/lib/Spinner';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Package, Truck } from 'lucide-react';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId || '');

  useEffect(() => {
    if (!orderId) {
      router.push('/checkout/cart');
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [orderId, router]);

  if (isLoading) return <Spinner />;
  if (!orderId || !orderData) return null;

  const { totalAmount, items, status, createdAt } = orderData.data;

  return (
    <div className='min-h-screen bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4'>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-4xl'
      >
        <Card className='shadow-2xl bg-white  backdrop-blur-sm'>
          <CardHeader className='text-center border-b border-gray-200 pb-6'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              className='mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4'
            >
              <CheckCircle className='w-12  h-12 text-green-500' />
            </motion.div>
            <CardTitle className='text-3xl font-bold text-green-700'>Payment Successful</CardTitle>
            <CardDescription className='text-gray-600 mt-2'>Thank you for your purchase. Your order has been confirmed.</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg text-gray-700'>Order Details</h3>
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-600'>
                    Order Id: <span className='font-medium text-blue-700'>{orderId}</span>
                  </p>
                  <p className='text-sm text-gray-600'>
                    Date: <span className='font-medium text-blue-700'>{new Date(createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className='text-sm text-gray-600'>
                    Total Amount: <span className='font-medium text-blue-700'>₹{totalAmount.toFixed(2)}</span>
                  </p>
                  <p className='text-sm text-gray-600'>
                    Items: <span className='font-medium text-blue-700'>{items.length}</span>
                  </p>
                </div>
                <div className='bg-green-50 p-4 rounded-lg'>
                  <h4 className='font-semibold text-green-700 mb-2'>Order Status</h4>
                  <div className='flex items-center text-green-600'>
                    <Package className='w-5 h-5 mr-2' />
                    <span className='text-sm font-semibold'>{status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg text-gray-700'>What’s Next?</h3>
                <ul className='space-y-3'>
                  <motion.li className='flex items-center text-gray-600' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Calendar className='w-5 h-5 mr-2 text-purple-500' />
                    <span>You’ll receive a confirmation email shortly</span>
                  </motion.li>
                  <motion.li className='flex items-center text-gray-600' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Truck className='w-5 h-5 mr-2 text-blue-500' />
                    <span>Your order will be processed and shipped soon</span>
                  </motion.li>
                  <motion.li className='flex items-center text-gray-600' initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Calendar className='w-5 h-5 mr-2 text-green-500' />
                    <span>You can track your order status in your account</span>
                  </motion.li>
                </ul>
              </div>
            </div>
            <div className='mt-8 text-center'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-6 py-2 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300'
                onClick={() => router.push('/')}
              >
                Continue Shopping
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
