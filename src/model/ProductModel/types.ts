import { Schema } from 'mongoose'

export interface ImagesTypes {
    public_id: string
    url: string
}

export interface ReviewsTypes {
    user: Schema.Types.ObjectId
    name: string
    rating: number
    comment: string
}

export interface ProductTypes {
    name: string
    description: string
    price: number
    ratings?: number
    images: ImagesTypes[]
    category: string
    stock: number
    numOfReviews?: number
    reviews: ReviewsTypes[]
    user?: Schema.Types.ObjectId
    createdAt: Date
}
