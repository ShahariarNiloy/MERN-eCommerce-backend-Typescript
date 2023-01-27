import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controllers/productController";

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(createProduct);

export default router;
