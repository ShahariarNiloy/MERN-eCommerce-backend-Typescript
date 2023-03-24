import type { Schema } from 'mongoose'

export interface ShippingInfoTypes {
    address: string
    city: string
    state: string
    country: string
    pinCode: number
    phoneNo: number
}

export interface PaymentInfoTypes {
    id: string
    status: string
}

export interface OrderItemsTypes {
    name: string
    price: number
    quantity: number
    image: string
    product: Schema.Types.ObjectId
}

export interface OrderTypes {
    shippingInfo: ShippingInfoTypes
    orderItems: OrderItemsTypes[]
    user: Schema.Types.ObjectId

    paymentInfo: PaymentInfoTypes
    paidAt: Date
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
    orderStatus: string
    deliveredAt: Date
    createdAt: Date
}
