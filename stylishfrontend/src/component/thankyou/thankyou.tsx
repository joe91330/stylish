import React from "react";
import styled from "styled-components";

const ThankYouContainer = styled.div`
  text-align: center;
  margin: 50px auto;
`;

const ThankYouTitle = styled.h1`
  color: #333;
`;

const OrderDetails = styled.div`
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
`;

const OrderNumber = styled.h2`
  color: #555;
`;

const OrderDate = styled.h2`
  color: #555;
`;

function Thankyou() {
  const currentTime = new Date();
  const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

  return (
    <ThankYouContainer>
      <ThankYouTitle>Thank you for your order!</ThankYouTitle>
      <OrderDetails>
        <OrderNumber>Order number: 123456789</OrderNumber>
        <OrderDate>Order date: {formattedTime}</OrderDate>
      </OrderDetails>
    </ThankYouContainer>
  );
}

export default Thankyou;
