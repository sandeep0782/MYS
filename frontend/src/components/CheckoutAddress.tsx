'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { PlusIcon, Pencil } from 'lucide-react'
import Spinner from '@/lib/Spinner'
import { Address } from '@/lib/types/type'
import { Input } from './ui/input'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from './ui/form'  // adjust the import path based on your project structure
import { useAddOrUpdateAddressMutation, useGetAddressesQuery } from '@/store/addressApi'


interface CheckoutAddressProps {
    onAddressSelect: (selectedAddress: Address) => void;
    selectedAddressId?: string;
}
interface AddressResponse {
    success: boolean;
    message: string;
    data: { addresses: Address[] }
}
const addressFormSchema = zod.object({
    phoneNumber: zod.string().min(10, "Phone number must be 10 digits"),
    addressLine1: zod.string().min(5, "Address line 1 should have at least 5 characters"),
    addressLine2: zod.string().optional(),
    addressLine3: zod.string().optional(),
    city: zod.string().min(2, "City should have at least 2 characters"),
    state: zod.string().min(2, "State should have at least 2 characters"),
    pin: zod.string().min(6, "Pin Code should have at least 6 digits"),
})

type AddressFormValues = zod.infer<typeof addressFormSchema>

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ onAddressSelect, selectedAddressId }) => {
    const { data: addressData, isLoading } = useGetAddressesQuery() as {
        data: AddressResponse | undefined;
        isLoading: boolean;
    }

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation()
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            phoneNumber: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            pin: ''
        }
    })

    const addressList = addressData?.data?.addresses || []

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address)
        form.reset(address)
        setShowAddressForm(true)
    }

    const onSubmit = async (data: AddressFormValues) => {
        try {
            if (editingAddress) {
                const updatedAddress = { ...editingAddress, ...data, addressId: editingAddress._id }
                const response = await addOrUpdateAddress(updatedAddress).unwrap()
                onAddressSelect(response.data) // select the updated address
            } else {
                const response = await addOrUpdateAddress(data).unwrap()
                onAddressSelect(response.data) // select the newly added address
            }

            setShowAddressForm(false)
            setEditingAddress(null)
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) return <Spinner />

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                {addressList.map((address: Address) => (
                    <Card
                        key={address._id}
                        className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddressId === address._id
                            ? 'border-blue-500 shadow-lg'
                            : 'border-gray-200 shadow-md hover:shadow-lg'
                            }`}
                    >
                        <CardContent className='p-6 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <Checkbox
                                    checked={selectedAddressId === address._id}
                                    onCheckedChange={() => onAddressSelect(address)}
                                />

                                <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => handleEditAddress(address)}
                                >
                                    <Pencil className='h-5 w-5 text-gray-500 hover:text-blue-500' />
                                </Button>
                            </div>
                            <div className='text-sm text-gray-600'>
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                                <p>
                                    {address.city}, {address.state} {address.pin}
                                </p>
                                <p className='mt-2 font-medium'>{address.phoneNumber}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                <DialogTrigger asChild>
                    <Button className='w-full' variant='outline'>
                        <PlusIcon className='mr-2 h-4 w-4' />
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add new Address"}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter mobile no" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="addressLine1"   // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address Line 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Street address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="addressLine2"  // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adress Line 2</FormLabel>
                                        <FormControl>
                                            <Input placeholder="apartment" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="addressLine3"  // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adress Line 3</FormLabel>
                                        <FormControl>
                                            <Input placeholder="apartment" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"  // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="apartment" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"  // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="apartment" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pin"  // ✅ correct
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>pin</FormLabel>
                                        <FormControl>
                                            <Input placeholder="apartment" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full'>
                                {editingAddress ? 'Update Address' : 'Add Address'}
                            </Button>
                        </form>

                    </Form>
                </DialogContent>
            </Dialog >
        </div >
    )
}

export default CheckoutAddress
