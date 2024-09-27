import React from "react";
import styled from "styled-components";
import { Link, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import GetProductSearch from "../../hooks/useGetProductSearch.tsx";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-size: 1.5rem;
  font-weight: normal;
  font-family: "Noto Sans TC";
`;
const Logo = styled.img`
  width: 300px;
`;
const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 1rem;
  width: 30%;
  height: 3rem;

  color: black;
  font-size: 1rem;
  font-weight: normal;
  font-family: "Noto Sans TC";
  line-height: 1.75;
  letter-spacing: 30px;

  & > div {
    border-right: 1px solid black;
    padding: 0 0.5rem;
  }
  & > div:last-child {
    border-right: none;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #4c5267;
  border-radius: 1.5rem;
  padding: 0.5rem;
  margin-left: auto;
  height: 3rem;

  & > input {
    border: none;
  }

  & > img {
    margin-left: 0.5rem;
  }
`;
const IconContainer = styled.div`
  margin-left: 0.75rem;
  position: relative;

  & > img {
    width: 100%;
    height: 100%;
  }
  & > .item-count {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #8b572a;
    color: white;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    padding: 0.25rem;
    font-size: 0.75rem;
    z-index: 1;
  }
  & > img:last-child {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.3s;
  }

  &:hover > img:last-child {
    opacity: 1;
  }
`;
const BackgroundBar = styled.div`
  background-color: #2d323e;
  height: 1.5rem;
`;

const ContainerSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
`;
const LogoSmall = styled.img`
  margin: 0 30%;
  width: 300px;
`;
const SearchIconSmall = styled.img`
  position: absolute;
  top: 1%;
  left: 95%;
`;
const NavigationSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  background-color: #2d323e;
  height: 3rem;

  color: #828282;
  font-size: 1rem;
  font-weight: normal;
  font-family: "Noto Sans TC";
  line-height: 1.75;
  letter-spacing: 2rem;

  & > div {
    border-right: 1px solid #828282;
    background-color: #2d323e;
  }
  & > div:last-child {
    border-right: none;
  }
`;
const CategorySmall = styled.button`
  padding-left: 2rem;
  text-align: center;
`;

function Header({ onSearchChange, cartItemCount }) {
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleCategory = (category) => {
    navigate(`/${category}`);
  };
  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      onSearchChange(searchTerm);
      // navigate(`/search`);
    }
  };
  return isSmallScreen ? (
    <div>
      <ContainerSmall>
        <LogoSmall src="/images/logo.png" alt="logo" />
      </ContainerSmall>
      <SearchIconSmall src="/images/search.png" alt="logo" />
      <NavigationSmall>
        <CategorySmall onClick={() => handleCategory("women")}>
          女裝
        </CategorySmall>
        <CategorySmall onClick={() => handleCategory("men")}>
          男裝
        </CategorySmall>
        <CategorySmall onClick={() => handleCategory("accessories")}>
          配件
        </CategorySmall>
      </NavigationSmall>
    </div>
  ) : (
    <div>
      <Container>
        <Logo src="/images/logo.png" alt="logo" />
        <Navigation>
          <CategorySmall onClick={() => handleCategory("women")}>
            女裝
          </CategorySmall>
          <CategorySmall onClick={() => handleCategory("men")}>
            男裝
          </CategorySmall>
          <CategorySmall onClick={() => handleCategory("accessories")}>
            配件
          </CategorySmall>
        </Navigation>
        <SearchContainer>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <img src="/images/search.png" alt="logo" />
        </SearchContainer>
        <IconContainer>
          <img src="/images/cart.png" alt="logo" />
          {cartItemCount > 0 && (
            <div className="item-count">{cartItemCount}</div>
          )}
          <img
            src="/images/cart-hover.png"
            alt="logo"
            onClick={() => navigate(`/checkout`)}
          />
        </IconContainer>
        <IconContainer>
          <img src="/images/member.png" alt="logo" />
          <img src="/images/member-hover.png" alt="logo" />
        </IconContainer>
      </Container>
      <BackgroundBar />
    </div>
  );
}

export default Header;
