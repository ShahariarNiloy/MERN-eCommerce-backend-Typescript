import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/productController";

const router = express.Router();

router.route("/products").get(getAllProducts);
// router.route("/product/:id").get(getProductDetails);
router.route("/admin/product/new").post(createProduct);
router.route("/admin/product/:id").put(updateProduct);
//   .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

export default router;
