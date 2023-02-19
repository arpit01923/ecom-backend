const { verifyToken, verifyTokenAndAuthorisation } = require("./verifyToken");

const router = require("express").Router();

// update password
// router.put("/:id", verifyTokenAndAuthorisation, (req, res) => {
//   if (req.body.password)
//     req.body.password = CryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.SECRET_KEY
//     ).toString();
// });

module.exports = router;
