import { Request, Response, NextFunction } from "express";
import Product from "../model/productModel";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    //   return next(new ErrorHandler("Product not found", 404));
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
};
