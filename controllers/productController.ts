import { Request, Response, NextFunction } from "express";
import Product from "../model/productModel";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

export const getAllProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ message: "Route is working fine !!" });
};
