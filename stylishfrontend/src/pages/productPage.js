import Header from "../component/header/header.js";
import Infodisplay from "../component/infodisplay/infodisplay.tsx";
import Product from "../component/product/product.tsx";
import Footer from "../component/footer/footer.js";
import GetProductList from "../hooks/useGetProductList.tsx";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useState, useEffect } from "react";
import GetProductSearch from "../hooks/useGetProductSearch.tsx";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";


const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0 1rem;
`;

const ProductPageLayout = ({ endpoint }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ref, inView] = useInView();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchPage, setSearchPage] = useState(false);
  const navigate = useNavigate();

  const { data, error, isLoading, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["productList", endpoint],
      queryFn: ({ pageParam = 1 }) => GetProductList(endpoint, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.next_paging || undefined,
      enabled: !!endpoint,
      onLoadMore: (lastPage, allPages) => {
        console.log("onloading", lastPage);
      },
      staleTime: Infinity,
    });

  useEffect(() => {
    const existingCart = localStorage.getItem("cart");

    // 如果 localStorage 中有購物車資料，計算商品數量
    if (existingCart) {
      const cart = JSON.parse(existingCart);
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(itemCount);
    }
  }, []);

  const {
    data: searchData,
    error: searchError,
    isLoading: searchLoading,
    refetch: searchReftch,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
  } = useInfiniteQuery({
    queryKey: ["productSearch", searchTerm],
    queryFn: ({ pageParam = 1 }) => GetProductSearch(searchTerm, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.next_paging || undefined,
    enabled: !!searchTerm,
    onLoadMore: (lastPage, allPages) => {
      console.log("onloading", lastPage);
    },
    staleTime: Infinity,
  });
  useEffect(() => {
    if (inView && hasNextPage && !searchPage) {
      fetchNextPage();
    }
    if (inView && hasNextSearchPage && searchPage) {
      fetchNextSearchPage();
    }
  }, [inView, hasNextPage, hasNextSearchPage, searchPage]);


  const handleProductClick = (productId) => {
    console.log("Product clicked with id:", productId);
    navigate(`/product/${productId}`);
  };

  const handleSearchChange = async (e) => {
    setSearchTerm(e);
    setSearchPage(true);
  };
  if (isLoading || searchLoading) {
    return <div>Loading...</div>;
  }
  if (error || searchError) {
    return <div>Error: {error.message}</div>;
  }
  console.log("searchDatadata", searchData);
  return (
    <div>
      <Header
        refetch={refetch}
        onSearchChange={handleSearchChange}
        searchReftch={searchReftch}
        cartItemCount={cartItemCount}
      />
      <Infodisplay />
      {(searchPage ? searchData?.pages : data?.pages)?.map((page, pageIndex) => (
        <ProductContainer key={pageIndex}>
          {page.data.map((item) => (
            <div
              style={{ cursor: "pointer", zIndex: 1 }}
              onClick={() => handleProductClick(item.id)}
            >
              <Product key={item.id} product={item} />
            </div>
          ))}
        </ProductContainer>
      ))}

      <div ref={ref}>
        <Footer cartItemCount={cartItemCount} />
      </div>
    </div>
  );
};

export default ProductPageLayout;
