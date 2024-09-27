import React from "react";
import styled from "styled-components";
import GetProductDetail from "../../hooks/useGetProductDetail";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;
const ProductIntro = styled.div`
  display: flex;
`;
const TextIntro = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;

  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: 400;
`;
const ProductTitle = styled.div`
  font-size: 2rem;
  line-height: 2rem
  letter-spacing: 0.4rem;
`;
const ProductPrice = styled.div`
  font-size: 1.875rem;
  line-height: 2.25rem;
  border-bottom: 0.5px solid #3f3a3a;
`;
const ProductCSAContainer = styled.div`
  font-size: 1.25rem;
  line-height: 1.5rem;
  letter-spacing: 0.25rem;
  margin: 0.5rem;
  display: flex;
  align-items: center;
`;
const ProductCSAFont = styled.span`
  border-right: 0.5px solid #3f3a3a;
  padding-right: 0.5rem;
`;

const ProductColor = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid #d3d3d3;
  margin: 1rem;
  display: inline-block;
`;
const ProductSize = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: black;
  color: white;
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddToCart = styled.button`
  border: 1px solid #979797;
  background: #000;
  width: 20rem;
  height: 4rem;

  color: #fff;
  font-family: Noto Sans TC;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem; /* 150% */
  letter-spacing: 0.25rem;
  text-align: center;
`;

const ProductDescription = styled.div`
  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem;
`;

const ChoseAmount = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  border: 1px solid #d3d3d3;
  div {
    margin: 0 1rem;
    color: brown;
  }
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
  colors: [
    {
      code: string;
      name: string;
    }
  ];
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
}

function ProductDeatail() {
  const main_image = "/images/cloth.png";
  const productDemo0 = "/images/productDemo0.png";
  const productDemo1 = "/images/productDemo1.png";
  const [chosenColor, setChosenColor] = useState("");
  const [chosenSize, setChosenSize] = useState("");
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const { product_id } = useParams();
  const id = Number(product_id);

  const { data, error, isLoading } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: () => GetProductDetail(id),
  });

  const addToCart = (
    main_image: string,
    productName: string,
    price: number,
    color: string,
    size: string,
    quantity: number,
    stock: number
  ) => {
    if (quantity === 0) {
      alert("請選擇數量");
      return;
    }
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingProductIndex = cart.findIndex(
      (item: {
        productName: string;
        color: string;
        size: string;
        stock: number;
      }) =>
        item.productName === productName &&
        item.color === color &&
        item.size === size
    );

    // 如果找到相同的商品，更新數量；否則，新增商品到購物車
    if (existingProductIndex !== -1 && quantity > 0) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({
        main_image,
        productName,
        price,
        color,
        size,
        quantity,
        stock,
      });
    }

    // 將更新後的購物車資訊存回 localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    setChosenColor("");
    setChosenSize("");
    setQuantity(0);

    alert("商品已加入購物車！");
    window.location.reload();
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const product: ProductType = data.data!;
  console.log("product", product);

  return (
    <ProductContainer>
      <ProductIntro>
        <img src={product.main_image || main_image} alt="cloth"></img>
        <TextIntro>
          <ProductTitle>{product?.title || "test"}</ProductTitle>
          <div>201807201824</div>
          <ProductPrice>TWD. {product?.price || "test 799"}</ProductPrice>
          <ProductCSAContainer>
            <ProductCSAFont>顏色</ProductCSAFont>
            {product?.colors.map((color) => (
              <ProductColor
                key={color.code}
                style={{ backgroundColor: color.code }}
                onClick={() => setChosenColor(color.code)}
              ></ProductColor>
            ))}
          </ProductCSAContainer>
          <ProductCSAContainer>
            <ProductCSAFont>尺寸</ProductCSAFont>

            {chosenColor !== "" &&
              product?.variants
                ?.filter(
                  (variant) =>
                    variant.color_code === chosenColor && variant.stock > 0
                )
                .map((variant) => (
                  <ProductSize
                    key={variant.size}
                    style={{
                      backgroundColor:
                        chosenSize === variant.size ? "black" : "grey",
                      color: chosenSize === variant.size ? "white" : "black",
                    }}
                    onClick={() => {
                      setChosenSize(variant.size);
                      setStock(variant.stock);
                    }}
                  >
                    {variant.size}
                  </ProductSize>
                ))}
          </ProductCSAContainer>
          <ProductCSAContainer>
            <ProductCSAFont>數量</ProductCSAFont>
            {chosenSize !== "" && (
              <ChoseAmount>
                <button onClick={() => setQuantity(Math.max(0, quantity - 1))}>
                  -
                </button>
                <div>{quantity}</div>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                >
                  +
                </button>
              </ChoseAmount>
            )}
          </ProductCSAContainer>
          <AddToCart
            onClick={() =>
              addToCart(
                product.main_image,
                product.title,
                product.price,
                chosenColor,
                chosenSize,
                quantity,
                stock
              )
            }
          >
            加入購物車
          </AddToCart>
          <ProductDescription>
            {product?.note || "實品顏色依單品照為主"}
          </ProductDescription>
          <ProductDescription>
            {product?.texture || "棉 100%"}
          </ProductDescription>
          <ProductDescription>
            {product?.description || "厚薄：薄\r\n彈性：無"}
          </ProductDescription>
          <ProductDescription>
            {product?.wash || "手洗，溫水"}
          </ProductDescription>
          <ProductDescription>{product?.place || "台灣"}</ProductDescription>
        </TextIntro>
      </ProductIntro>
      <div>更多產品資訊</div>
      <ProductDescription>
        {product?.story || "這是產品故事TXTXTXTXTXTXT"}
      </ProductDescription>
      <img src={product?.images?.[0] || productDemo0} alt="cloth"></img>
      <img src={product?.images?.[1] || productDemo1} alt="cloth"></img>
    </ProductContainer>
  );
}

export default ProductDeatail;
