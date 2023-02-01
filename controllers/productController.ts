import type { NextFunction, Request, Response } from 'express'
import type { ObjectId } from 'mongoose'
import Product from '../model/ProductModel/productModel'
import ApiFeatures from '../utils/apiFeatures'
import ErrorHandler from '../utils/errorHandler'

export const createProductAdmin = async (
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
        const resultPerPage = 8
        const productsCount = await Product.countDocuments()

        const apiFeature = new ApiFeatures(Product.find(), req?.query)
            .search()
            .filter()

        let products = await apiFeature.query

        let filteredProductsCount = products.length

        apiFeature.pagination(resultPerPage)

        products = await apiFeature.query.clone()

        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount,
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

export const getProductsAdmin = async (
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

export const updateProductAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let product = await Product.findById(req.params.id)

        if (product === null) {
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

export const deleteProductAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product === null) {
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

        if (product === null) {
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

    if (product === null) {
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
            if (rev._id !== null && rev._id !== undefined) {
                return JSON.stringify(rev._id) !== req.query.id?.toString()
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
    const { rating, comment, productId, userId, userName } = req.body

    if (
        !(rating ?? false) ||
        !(comment ?? false) ||
        !(productId ?? false) ||
        !(userId ?? false) ||
        !(userName ?? false)
    ) {
        next(new ErrorHandler('Cannot add review. Not sufficient info.', 404))
        return
    }
    try {
        const review = {
            user: userId,
            name: userName,
            rating: Number(rating),
            comment,
        }

        const product = await Product.findById(productId)

        if (product == null) {
            next(new ErrorHandler('Cannot add review. Product not found.', 404))
            return
        }

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === userId.toString()
        )

        if (isReviewed !== null) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === userId.toString()) {
                    rev.rating = rating
                    rev.comment = comment
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
