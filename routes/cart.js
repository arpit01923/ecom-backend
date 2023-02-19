const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get Cart Products
router.get("/cart/:id", async (req, res) => {
  try {
    const data = await Cart.find();
    const user = data.find((item) => item.userId === req.params.id);
    const productData = await Product.find();
    const filteredProducts = productData.filter((item) => {
      const selectedData = user?.products?.find(
        (inst) => JSON.stringify(item._id) === JSON.stringify(inst.productId)
      );
      return JSON.stringify(selectedData?._id)
        ? { ...item._doc, quantity: selectedData.quantity }
        : null;
    });
    res.status(200).json({
      success: true,
      cart: filteredProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Add Cart Products
router.post("/cart", async (req, res) => {
  try {
    const data = await Cart.find();
    const user = data.find((item) => item.userId === req.body.userId);
    if (user?._id) {
      const product = user?.products?.find(
        (item) => item?.productId === req?.body?.productId
      );
      if (product?.productId) {
        res.status(403).json({
          success: false,
          message: "Product already exist in cart",
        });
      } else {
        const updateProduct = [
          ...user.products,
          { productId: req.body.productId, quantity: 1 },
        ];
        // update Cart
        const filter = { userId: req.body.userId };
        const update = {
          userId: req.body.userId,
          products: updateProduct,
        };
        const savedCart = await Cart.findOneAndUpdate(filter, update, {
          new: true,
        });
        res.status(200).json({
          success: true,
          cart: savedCart,
          message: "Product successfully added to cart",
        });
      }
    } else {
      const addProduct = [{ productId: req.body.productId, quantity: 1 }];
      newCart = new Cart({
        userId: req.body.userId,
        products: addProduct,
      });
      // save cart
      const savedCart = await newCart.save();
      res.status(200).json({
        success: true,
        cart: savedCart,
        message: "Product successfully added to cart",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Add Update Cart
router.put("/cart/:id", async (req, res) => {
  try {
    // 0 stands for decrease
    if (req.query.status === "0") {
      const user = await Cart.findOne({ userId: req.params.id });
      const updatedProducts = user.products.map((item) =>
        item.productId === req.body.productId
          ? { ...item._doc, quantity: item.quantity - 1 }
          : item
      );
      const updatedCart = { ...user._doc, products: updatedProducts };
      const savedCart = await Cart.findOneAndUpdate(
        { userId: req.params.id },
        updatedCart,
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        cart: savedCart,
        message: "Cart updated successfully",
      });
    } else {
      // 1 stands for increase
      const user = await Cart.findOne({ userId: req.params.id });
      const updatedProducts = user.products.map((item) =>
        item.productId === req.body.productId
          ? { ...item._doc, quantity: item.quantity + 1 }
          : item
      );
      const updatedCart = { ...user._doc, products: updatedProducts };
      const savedCart = await Cart.findOneAndUpdate(
        { userId: req.params.id },
        updatedCart,
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        cart: savedCart,
        message: "Cart updated successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete product from cart
router.delete("/cart/:id", async (req, res) => {
  try {
    const data = await Cart.find();
    const user = data.find((item) => item.userId === req.params.id);
    let updatedProducts = user.products.filter(
      (item) => item.productId !== req.body.productId
    );
    const updatedCart = { ...user._doc, products: updatedProducts };
    const savedCart = await Cart.findOneAndUpdate(
      { userId: req.params.id },
      updatedCart,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      cart: savedCart,
      message: "Product removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
