import Header from "../component/header/header.js";
import Footer from "../component/footer/footer.js";
import { useState, useEffect } from "react";
import ProductDeatail from "../component/productDetail/productDetail.tsx";

const ProductDetailPage = () => {
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
      <ProductDeatail />
      <Footer cartItemCount={cartItemCount} />
    </div>
  );
};

export default ProductDetailPage;
