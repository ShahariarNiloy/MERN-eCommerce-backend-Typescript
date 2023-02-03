import type { Model } from 'mongoose'
import { model, Schema } from 'mongoose'
import type { ProductTypes } from './types'

const productSchema = new Schema<ProductTypes, Model<ProductTypes>, unknown>({
    name: {
        type: String,
        required: [true, 'Please Enter product Name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please Enter product Description'],
    },
    price: {
        type: Number,
        required: [true, 'Please Enter product Price'],
        maxLength: [8, 'Price cannot exceed 8 characters'],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, 'Please Enter Product Category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please Enter product Stock'],
        maxLength: [4, 'Stock cannot exceed 4 characters'],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const ProductModel = model('Product', productSchema)

export default ProductModel
