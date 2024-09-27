import React, { useState, useEffect } from "react";
import styled from "styled-components";

const WholePage = styled.div`
  background-color: #313538;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10vh;
  margin: auto;
`;
const Text = styled.div`
  display: flex;
  color: white;
  padding-right: 3rem;
`;
const Images = styled.img`
  padding-left: 1rem;
  padding-right: 1rem;
`;
const Copyright = styled.div`
  color: #828282;
  font-family: Noto Sans TC;
  font-size: 0.75rem;
`;
const WholePageSmall = styled.div`
  background-color: #313538;
  padding-top: 1rem;

  height: 20vh;
  margin: auto;
`;
const InfoSmall = styled.div`
  display: flex;
  justify-content: center;
  display: flex;
  justify-content: center;
`;

const TextSmall = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding-right: 3rem;
`;
const ImagesSmall = styled.img`
  width: 40px;
  height: 40px;
  margin: 1rem;
`;
const CopyrightSmall = styled.div`
  color: #828282;
  font-family: Noto Sans TC;
  font-size: 0.75rem;
  text-align: center;
`;
const CartAndMemberSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
`;
const CartAndMemWordSmall = styled.div`
  color: white;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;
const VerticalBarSmall = styled.div`
  background-color: white;
  width: 1px;
  height: 30px;
  margin: 0 1rem;
`;
const CartContainerSmall = styled.div`
  position: relative;
  & > .item-count {
    position: absolute;
    background-color: #8b572a;
    color: white;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    padding: 0.25rem;
    font-size: 0.75rem;
    z-index: 1;
    bottom: 0;
    right: 0;
  }
`;

function Footer({ cartItemCount }) {
  // RWD適用
  const [isSmallScreen, setIsSmallScreen] = useState(false);
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
  return isSmallScreen ? (
    <WholePageSmall>
      <InfoSmall>
        <TextSmall>
          <div>關於 SRYLish</div>
          <div>服務條款</div>
          <div>隱私政策</div>
        </TextSmall>
        <TextSmall>
          <div>聯絡我們</div>
          <div>FAQ</div>
        </TextSmall>
        <ImagesSmall
          src="/images/line.png"
          alt="twitter"
          width={30}
          height={30}
        />
        <ImagesSmall
          src="/images/twitter.png"
          alt="twitter"
          width={30}
          height={30}
        />
        <ImagesSmall
          src="/images/facebook.png"
          alt="twitter"
          width={30}
          height={30}
        />
      </InfoSmall>
      <CopyrightSmall>© 2018. All rights reserved.</CopyrightSmall>
      <CartAndMemberSmall>
        <CartContainerSmall>
          <Images
            src="/images/cart-mobile.png"
            alt="cart"
            width={60}
            height={60}
          />
          {cartItemCount > 0 && (
            <div className="item-count">{cartItemCount}</div>
          )}
        </CartContainerSmall>
        <CartAndMemWordSmall>購物車</CartAndMemWordSmall>
        <VerticalBarSmall />
        <Images
          src="/images/member-mobile.png"
          alt="cart"
          width={60}
          height={60}
        />
        <CartAndMemWordSmall>會員</CartAndMemWordSmall>
      </CartAndMemberSmall>
    </WholePageSmall>
  ) : (
    <WholePage>
      <Text>
        <div>關於 SRYLish | </div>
        <div>服務條款 | </div>
        <div>隱私政策 | </div>
        <div>聯絡我們 | </div>
        <div>FAQ</div>
      </Text>
      <Images src="/images/line.png" alt="twitter" />
      <Images src="/images/twitter.png" alt="twitter" />
      <Images src="/images/facebook.png" alt="twitter" />
      <Copyright>© 2018. All rights reserved.</Copyright>
    </WholePage>
  );
}

export default Footer;
