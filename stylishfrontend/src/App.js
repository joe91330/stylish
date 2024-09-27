import ProductPageLayout from "./pages/productPage.js";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "./app.module.scss";
import CheckoutPage from "./pages/checkoutPage.js";
import ThankyouPageLayout from "./pages/thankyouPage.js";

import ProductDetailPage from "./pages/productDetailPage.js";

const queryClient = new QueryClient();
function App() {
  // const productNum = [1, 2, 3, 4, 5, 6];

  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <div className={styles.productDemo}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProductPageLayout endpoint="all" />} />
            <Route
              path="/women"
              element={<ProductPageLayout endpoint="women" />}
            />
            <Route path="/men" element={<ProductPageLayout endpoint="men" />} />
            <Route
              path="/accessories"
              element={<ProductPageLayout endpoint="accessories" />}
            />
            <Route path="/product/:product_id" element={<ProductDetailPage />} />

            <Route path="/search" element={<ProductPageLayout />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thankyou" element={<ThankyouPageLayout />} />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
