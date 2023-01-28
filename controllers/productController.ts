import type { NextFunction, Request, Response } from 'express'
import type { ObjectId } from 'mongoose'
import Product from '../model/productModel'
import ErrorHandler from '../utils/errorHandler'

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({
            success: true,
            product,
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, message: err.message })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
            })
        }
    }
}

export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await Product.find()
        res.status(200).json({ success: true, products })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, message: err.message })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
            })
        }
    }
}

export const getAdminProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await Product.find()

        res.status(200).json({
            success: true,
            products,
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        next(new ErrorHandler('Product not found', 404))
        return
    }

    // Images Start Here
    let images = []

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        // req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        product,
    })
}

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            next(new ErrorHandler('Product not found', 404))
            return
        }
        await product.remove()

        res.status(200).json({
            success: true,
            message: 'Product Deleted Successfully',
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
        return res
            .status(500)
            .json({ success: false, message: 'Something went wrong' })
    }
}

export const getProductDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product == null) {
            next(new ErrorHandler('Product not found', 404))
            return
        }

        res.status(200).json({
            success: true,
            product,
        })
    } catch (err) {
        if (err instanceof Error) {
            return res
                .status(500)
                .json({ success: false, message: err.message })
        }
        return res
            .status(500)
            .json({ success: false, message: 'Something went wrong' })
    }
}

export const getProductReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const product = await Product.findById(req.query.id)

    if (product == null) {
        next(new ErrorHandler('Product not found', 404))
        return
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
}

export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const product = await Product.findById(req.query.id)

    if (product == null) {
        next(new ErrorHandler('Product not found', 404))
        return
    }

    const reviews = product.reviews.filter(
        (rev: (typeof product)['reviews'][number] & { _id?: ObjectId }) => {
            if (rev._id != null) {
                return rev._id.toString() !== req.query.id?.toString()
            }
            return false
        }
    )

    let avg = 0

    reviews.forEach((rev) => {
        avg += rev.rating
    })

    let ratings = 0

    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length
    }

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(
        req.query.id,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    )

    res.status(200).json({
        success: true,
    })
}

export const createProductReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { rating, comment, productId, user_id, user_name } = req.body

    if (!rating || !comment || !productId || !user_id || !user_name) {
        next(new ErrorHandler('Cannot add review. Not sufficient info.', 404))
        return
    }
    try {
        const review = {
            user: user_id,
            name: user_name,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId)

        if (product == null) {
            next(new ErrorHandler('Cannot add review. Product not found.', 404))
            return
        }

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === user_id.toString()
        )

        if (isReviewed != null) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === user_id.toString()) {
                    ;(rev.rating = rating), (rev.comment = comment)
                }
            })
        } else {
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }

        let avg = 0

        product.reviews.forEach((rev) => {
            avg += rev.rating
        })

        product.ratings = avg / product.reviews.length

        await product.save({ validateBeforeSave: false })

        res.status(200).json({
            success: true,
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            return res
                .status(404)
                .json({ success: false, message: err.message })
        }
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}
