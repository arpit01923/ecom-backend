const router = require("express").Router();
const Product = require("../models/Product");

// Add product
router.post("/product", async (req, res) => {
  const newProduct = new Product({
    title: req.body.title,
    description: req.body.description,
    img: req.body.img,
    categories: req.body.categories,
    brand: req.body.brand,
    price: req.body.price,
  });
  try {
    const product = await Product.findOne({ title: req.body.title });
    if (product) res.status(200).json({ message: "Product already exist" });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: "Product created successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get product
router.get("/product", async (req, res) => {
  const { search, page, limit } = req.query;
  try {
    const data = await Product.find();
    const presentData = data.filter((item) => !item.isDeleted);
    const searchData =
      search?.length === 0
        ? presentData
        : presentData.filter(
            (item) =>
              item.title?.toLowerCase()?.match(search?.toLowerCase()) ||
              item.description?.toLowerCase()?.match(search?.toLowerCase()) ||
              item.brand?.toLowerCase()?.match(search?.toLowerCase())
          );
    const paginatedData = searchData.slice(page - 1, limit);
    const count = paginatedData?.length;
    res.status(200).json({
      success: true,
      count,
      products: paginatedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get Product By Id
router.get("/product/:id", async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      products: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete Product
router.delete("/product/:id", async (req, res) => {
  try {
    const data = await Product.findById(req.params.id);
    const deleteData = { ...data._doc, isDeleted: true };
    const updateData = await Product.findByIdAndUpdate(
      req.params.id,
      deleteData,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      products: updateData,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update Product
router.put("/product/:id", async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      products: data,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
