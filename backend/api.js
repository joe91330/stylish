require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mysqlPromise = require("mysql2/promise");
const dbPromise = mysqlPromise.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  (err) => {
    if (err) {
      console.error("Database connection error:", err);
    } else {
      console.log("Database connected successfully");
    }
  }
);
const bcrypt = require("bcryptjs");
const axios = require('axios');
const saltRounds = 10;
const hashUserPassword = async (plainPassword) => {
  try {
    const hashpassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log("Hashed Password:", hashpassword);
    return hashpassword;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const checkIfEmailExists = async (email) => {
  try {
    const sql = "SELECT COUNT(*) AS count FROM User WHERE email = ?";
    const [result] = await dbPromise.query(sql, [email]);
    return result[0].count > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying the database");
  }
};
const verifyPassword = async (email, password) => {
  try {
    const sql = "SELECT password FROM User WHERE email = ?";
    const [result] = await dbPromise.query(sql, [email]);
    const hashedPassword = result[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying the database");
  }
};
const getUserDataByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM User WHERE email = ?";
    const [result] = await dbPromise.query(sql, [email]);
    return result[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying the database");
  }
};
const getUserDataByID = async (id) => {
  try {
    const sql = "SELECT * FROM User WHERE id = ?";
    const [result] = await dbPromise.query(sql, [id]);
    return result[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying the database");
  }
};

const auththenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token verification failed" });
    }
    console.log("User:", user);
    req.user = user;
    next();
  });
};

const checkStock = async (productID, color_code, size, qty) => {
  try {
    const sql = `SELECT * FROM Variant WHERE product_id = ? AND color_code = ? AND size = ?`;
    const [result] = await dbPromise.query(sql, [productID, color_code, size]);
    if (result[0].stock < qty) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying the database");
  }
};
const processPayment = async function (prime, order) {
  try {
    const paymentData = {
      prime,
      partner_key: process.env.PARTNER_KEY,
      merchant_id: process.env.MERCHANT_ID,
      amount: order.total,
      details: "Order Payment",
      cardholder: {
        phone_number: order.recipient.phone,
        name: order.recipient.name,
        email: order.recipient.email,
        address: order.recipient.address,
      },
    };

    // 向 TapPay 支付請求
    const response = await axios.post(
      "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.PARTNER_KEY,
        },
      }
    );

    if (response.data.status === 0) {
      return  response.data ;
    } else {
      return { success: false, error: response.data.msg };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "Payment processing failed" };
  }
};

router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ error: "Email Already Exists" });
    }

    const hashpassword = await hashUserPassword(password);
    console.log("hashpassword", hashpassword);

    const connection = await dbPromise.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Insert product
    const sqlUser = `INSERT INTO User (name, email, password) VALUES (?, ?, ?)`;
    const [userResult] = await connection.query(sqlUser, [
      name,
      email,
      hashpassword,
    ]);

    // Commit the transaction
    await connection.commit();
    const tokenPayload = {
      email: email,
      name: name,
    };
    const access_token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const responseData = {
      data: {
        access_token: access_token,
        access_expired: 3600,
        user: {
          id: userResult.insertId,
          provider: "native",
          name: name,
          email: email,
          picture: null,
        },
      },
    };
    console.log(responseData);
    res.status(200).json(responseData);
  } catch (error) {
    // Rollback the transaction on error
    const connection = await dbPromise.getConnection();
    await connection.rollback();
    console.error("Database error:", error);
    res.status(500).json({ error: "Error inserting data into the database" });
  }
});

router.post("/user/signin", async (req, res) => {
  try {
    const { provider, email, password } = req.body;
    if (provider === "native") {
      // For native sign-in
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required for native sign-in",
        });
      }
      const userExists = await checkIfEmailExists(email);
      if (!userExists) {
        return res.status(409).json({ error: "Email not found" });
      }

      const passwordMatch = await verifyPassword(email, password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }
      const userData = await getUserDataByEmail(email);
      const tokenPayload = {
        email: email,
        provider: "native",
      };
      const access_token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      const responseData = {
        data: {
          access_token: access_token,
          access_expired: 3600,
          user: {
            id: userData.id,
            provider: "native",
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          },
        },
      };
      res.status(200).json(responseData);
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/profile", auththenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  const user_data = await getUserDataByEmail(userEmail);
  const responseData = {
    data: {
      provider: "native",
      name: user_data.name,
      email: user_data.email,
      picture: user_data.picture,
    },
  };
  res.status(200).json(responseData);
});

router.post("/order/checkout", auththenticateToken, async (req, res) => {
  try {
    const orders = [];
    const payments = [];
    await connection.beginTransaction();

    const { prime, order, list } = req.body;
    const orderRecord = {
      prime,
      order,
      paid: false,
    };
    orders.push(orderRecord);
    const isStockSufficient = await checkStock(
      160, // list.id,
      "#FFFFFF", // list.color,
      "S", // list.size,
      1 // list.qty
    );
    if (!isStockSufficient) {
      return res.status(400).json({ error: "Stock Insufficient" });
    }
    const paymentResult = await processPayment(prime, order);
    if (paymentResult.status === 0) {
      const paymentRecord = {
        order: orderRecord,
        amount: order.total,
      };
      const sql = "UPDATE Variant SET stock = stock - ? WHERE product_id = ? AND color_code = ? AND size = ?";
      const [result] = await dbPromise.query(sql, [1,160,"#FFFFFF","S"]);
      payments.push(paymentRecord);
      orderRecord.paid = true;
      await connection.commit();
      res
        .status(200)
        .json({ success: true, orderNumber: paymentResult.order_number });
    } else {
      res.status(400).json({ success: false, error: paymentResult });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
