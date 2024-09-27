import React from "react";
import styled from "styled-components";

const ProductContainer = styled.div`
  margin: 1rem;
`;
const ProductColor = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid #d3d3d3;
  margin: 0.5rem;
  display: inline-block;
`;
const ProductFont = styled.div`
  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: 0.25rem;
`;
interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  texture: string;
  wash: string;
  place: string;
  note: string;
  story: string;
  colors: string[];
  sizes: string[];
  variants: [
    {
      color_code: string;
      size: string;
      stock: number;
    }
  ];
  main_image: string;
  images: string[];
}

interface ProductProps {
  product: ProductType;
  pro1: number;
}

function Product({ product }: ProductProps) {
  const main_image = "images/cloth.png";
  return (
    <ProductContainer>
      <img src={product.main_image || main_image} alt="cloth" />

      {product.variants?.map((variant) => (
        <ProductColor
          key={variant.color_code}
          style={{ backgroundColor: variant.color_code }}
        ></ProductColor>
      ))}
      <ProductFont>{product.title || "test"}</ProductFont>
      <ProductFont>TWD. {product.price || "test 799"}</ProductFont>
    </ProductContainer>
  );
}

export default Product;
