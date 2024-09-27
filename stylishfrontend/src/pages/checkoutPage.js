import Header from "../component/header/header.js";
import Checkout from "../component/checkout/checkout.tsx";
import Footer from "../component/footer/footer.js";
import styled from "styled-components";
import { useState, useEffect } from "react";

const CheckoutLayout = styled.div`
  margin: 0 5rem;
`;

const CheckoutPage = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const existingCart = localStorage.getItem("cart");

    // 如果 localStorage 中有購物車資料，計算商品數量
    if (existingCart) {
      const cart = JSON.parse(existingCart);
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(itemCount);
    }
  }, []);
  return (
    <div>
      <Header cartItemCount={cartItemCount} />
      <CheckoutLayout>
        <Checkout />
      </CheckoutLayout>
      <Footer cartItemCount={cartItemCount} />
    </div>
  );
};

export default CheckoutPage;
