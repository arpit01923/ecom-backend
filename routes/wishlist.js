const { verifyToken } = require("./verifyToken");
const Product = require("../models/Product");
const router = require("express").Router();
const Wishlist = require("../models/Wishlist");

// Add Update wishlist
router.post("/wishlist", verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const isWishlistCreated = await Wishlist.findOne({ userId });
    if (isWishlistCreated) {
      // update wishlist
      const product = isWishlistCreated?.products?.find(
        (item) => item?.productId === productId
      );
      if (product?.productId) {
        // product already exist
        res
          .status(200)
          .json({ success: true, message: "Item already exist in wishlist" });
      } else {
        const updateProduct = [...isWishlistCreated.products, { productId }];
        // add product to wishlist
        const filter = { userId };
        const update = {
          userId: req.body.userId,
          products: updateProduct,
        };
        const savedWishlist = await Wishlist.findOneAndUpdate(filter, update, {
          new: true,
        });
        res.status(200).json({
          success: true,
          wishlist: savedWishlist,
          message: "Product successfully added to wishlist",
        });
      }
    } else {
      // create wishlist
      const newWishlist = new Wishlist({
        products: [{ productId }],
        userId,
      });
      const savedWishlist = await newWishlist.save();
      res.status(200).json(savedWishlist);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get wishlist
router.get("/wishlist/:id", verifyToken, async (req, res) => {
  try {
    const data = await Wishlist.find();
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
      wishlist: filteredProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete wishlist
router.delete("/wishlist/:id", verifyToken, async (req, res) => {
  try {
    const data = await Wishlist.find();
    const user = data.find((item) => item.userId === req.params.id);
    let updatedProducts = user.products.filter(
      (item) => item.productId !== req.body.productId
    );
    const updatedWishlist = { ...user._doc, products: updatedProducts };
    const savedCart = await Wishlist.findOneAndUpdate(
      { userId: req.params.id },
      updatedWishlist,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      wishlist: savedCart,
      message: "Product removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
