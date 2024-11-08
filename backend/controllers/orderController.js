const OrderModel = require('../models/orderModel');
const axios = require('axios');

class OrderController {
  static async processPayment(prime, order) {
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

    try {
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
      return response.data;
    } catch (error) {
      throw new Error("Payment processing failed");
    }
  }

  static async checkout(req, res) {
    try {
      const { prime, order, list } = req.body;

      const isStockSufficient = await OrderModel.checkStock(
        list.id,
        list.color,
        list.size,
        list.qty
      );

      if (!isStockSufficient) {
        return res.status(400).json({ error: "Stock Insufficient" });
      }

      const paymentResult = await OrderController.processPayment(prime, order);

      if (paymentResult.status === 0) {
        await OrderModel.updateStock(list.id, list.color, list.size, list.qty);
        await OrderModel.createOrder({
          user_id: req.user.id,
          total: order.total,
        });

        res.status(200).json({
          success: true,
          orderNumber: paymentResult.order_number,
        });
      } else {
        res.status(400).json({ success: false, error: paymentResult });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = OrderController; 