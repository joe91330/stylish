import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface OptionButtonProps {
  active?: boolean;
}
interface CartItem {
  main_image: string;
  productName: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  stock: number;
}
const PurchaseInfo = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;

  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1rem;
  font-style: normal;
  line-height: 1.1875rem;
`;
const PurchaseTitle = styled.div`
  display: flex;
  flex: 2;
  font-weight: 700;
`;
const PurchaseDetail = styled.div`
  flex: 1;
  font-weight: 400;
`;
const PurchaseInnerInfo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
const PurchaseCSAInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
`;
const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0;
`;
const CustomerInfoContainer = styled.div`
  width: 60%;
  margin: 0 auto 0 0;
  display: flex;
  align-items: center;
  padding: 20px 0;
`;
const CustomerInfo = styled.div`
  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.1875rem;
  flex: 1;
`;
const CustomerInfoInput = styled.input`
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  border-radius: 4px;
  width: 50%;
  height: 40px;
  flex: 4;
  padding: 0 1rem;
`;
const DeliveryTimeContainer = styled.div`
  display: flex;
  flex: 4;
`;
const OptionButton = styled.button`
  padding: 0.5rem;
  margin: 0.2rem;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 50%;

  &:hover {
    background-color: #ddd;
  }
`;
const ProductAmountSelect = styled.select`
  border-radius: 0.5rem;
  border: 1px solid #979797;
  background: #f3f3f3;
  width: 3rem;
  padding: 0 0.5rem;
`;

const BlackDot = styled.div<OptionButtonProps>`
  width: 10px;
  height: 10px;
  background-color: #000;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  display: ${(props) => (props.active ? "block" : "none")};
`;
const OptionFont = styled.div`
  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.625rem; /* 162.5% */
  padding-right: 0.5rem;
`;

const PaymentContainer = styled.div`
  width: 30%;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 0;
`;
const PaymentInfo = styled.div`
  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.1875rem;
`;
const PaymentWordAndMoneyContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;
const PaymentMoneyContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 1rem 0 auto;

  color: #3f3a3a;
  font-family: Noto Sans TC;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.1875rem;
`;
const PaymentMoney = styled.div`
  font-size: 1.875rem;
  line-height: 2.25rem;
`;
const ConfirmButton = styled.button`
  width: 100%;
  height: 3rem;
  background-color: black;

  color: #fff;
  font-family: Noto Sans TC;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.875rem; /* 150% */
  letter-spacing: 0.25rem;
  text-align: center;
`;
const CartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

function Checkout() {
  const [selectedTime, setSelectedTime] = useState("");
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };
  const existingCart = localStorage.getItem("cart");
  const cart = existingCart ? JSON.parse(existingCart) : [];
  const [cartStatus, setCartStatus] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const main_image = "images/cloth.png";
  const generateOptions = (max: number) => {
    const options = [];
    for (let i = 1; i <= max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    return options;
  };
  const handleQuantityChange = (
    productName: string,
    color: string,
    size: string,
    newQuantity: number
  ) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const updatedCart = cart.map((item: CartItem) => {
      if (
        item.productName === productName &&
        item.color === color &&
        item.size === size
      ) {
        item.quantity = newQuantity;
      }
      return item;
    });
    setCartStatus(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const handleTrashClick = (
    productName: string,
    color: string,
    size: string
  ) => {
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const itemIndex = cart.findIndex(
      (item: CartItem) =>
        item.productName === productName &&
        item.color === color &&
        item.size === size
    );

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartStatus(cart);
    }
    window.location.reload();
  };
  useEffect(() => {
    const calculateTotalPrice = () => {
      let totalPrice = 0;
      cart.forEach((item: CartItem) => {
        totalPrice += item.quantity * item.price;
      });
      setTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [cartStatus]);

  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    address: "",
    email: "",
    deliveryTime: "",
    cardNumber: "",
    cvv: "",
  });
  interface InputValidationProps {
    onChange: (data: FormData) => void;
  }
  // const InputValidation: React.FC<InputValidationProps> = ({ onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(formData, "e.target");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^\d{10}$/;
    const isValid = phoneRegex.test(formData.phoneNumber);
    if (!isValid) {
      alert("請輸入正確的手機號碼");
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(formData.email);
    if (!isValid) {
      alert("請輸入正確的電子郵件");
    }
  };
  const [phoneNumberinputType, setPhoneNumberinputType] = useState("text");
  const [emailInputType, setEmailInputType] = useState("text");
  const [cvvInputType, setCvvInputType] = useState("text");

  const handleBlurPhoneNumber = () => {
    validatePhoneNumber();
    setPhoneNumberinputType("password");
  };

  const handleBlurEmail = () => {
    validateEmail();
    setEmailInputType("password");
  };
  const handleBlurCvv = () => {
    setCvvInputType("password");
  };
  const navigate = useNavigate();
  const handlePayment = () => {
    const { recipientName, phoneNumber, address, email } = formData;
    if (!recipientName || !phoneNumber || !address || !email) {
      alert("請填寫所有欄位");
      return;
    }
    navigate("/thankyou");
  };

  return (
    <div>
      <PurchaseInfo>
        <PurchaseTitle>購物車</PurchaseTitle>
        <PurchaseDetail>數量</PurchaseDetail>
        <PurchaseDetail>單價</PurchaseDetail>
        <PurchaseDetail>小計</PurchaseDetail>
      </PurchaseInfo>
      <PurchaseInfo style={{ border: "1px solid #979797" }}>
        <CartContainer>
          {cart.map((item: CartItem, index: number) => (
            <PurchaseInnerInfo key={index} style={{ padding: "1rem" }}>
              <PurchaseTitle>
                <img
                  src={item.main_image || main_image}
                  alt=""
                  width={100}
                  height={100}
                />
                <PurchaseCSAInfo>
                  <div>{item.productName}</div>
                  <div>顏色｜{item.color}</div>
                  <div>尺寸｜{item.size}</div>
                </PurchaseCSAInfo>
              </PurchaseTitle>
              <PurchaseDetail>
                <ProductAmountSelect
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10);
                    handleQuantityChange(
                      item.productName,
                      item.color,
                      item.size,
                      newQuantity
                    );
                  }}
                >
                  {generateOptions(item.stock)}
                </ProductAmountSelect>
              </PurchaseDetail>
              <PurchaseDetail>TWD. {item.price}</PurchaseDetail>
              <PurchaseDetail>TWD. {item.quantity * item.price}</PurchaseDetail>
              <img
                src="/images/trash.png"
                alt=""
                width={50}
                height={50}
                onClick={() =>
                  handleTrashClick(item.productName, item.color, item.size)
                }
                style={{ cursor: "pointer" }}
              />
            </PurchaseInnerInfo>
          ))}
        </CartContainer>
      </PurchaseInfo>
      <PurchaseTitle>訂購資料</PurchaseTitle>
      <HorizontalLine />
      <CustomerInfoContainer>
        <CustomerInfo>收件人姓名</CustomerInfo>
        <CustomerInfoInput
          type="text"
          placeholder="務必填寫完整收件人姓名，避免包裹無法順利簽收"
          name="recipientName"
          value={formData.recipientName}
          onChange={handleInputChange}
        />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>手機</CustomerInfo>
        <CustomerInfoInput
          type={phoneNumberinputType}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          onBlur={handleBlurPhoneNumber}
        />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>地址</CustomerInfo>
        <CustomerInfoInput
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>E-mail</CustomerInfo>
        <CustomerInfoInput
          type={emailInputType}
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlurEmail}
        />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>配送時間</CustomerInfo>
        <DeliveryTimeContainer>
          <OptionButton onClick={() => handleTimeClick("08:00-12:00")}>
            <BlackDot active={selectedTime === "08:00-12:00"} />
          </OptionButton>
          <OptionFont>08:00-12:00</OptionFont>
          <OptionButton onClick={() => handleTimeClick("14:00-18:00")}>
            <BlackDot active={selectedTime === "14:00-18:00"} />
          </OptionButton>
          <OptionFont>14:00-18:00</OptionFont>
          <OptionButton onClick={() => handleTimeClick("不指定")}>
            <BlackDot active={selectedTime === "不指定"} />
          </OptionButton>
          <OptionFont>不指定</OptionFont>
        </DeliveryTimeContainer>
      </CustomerInfoContainer>
      <PurchaseTitle>付款資料</PurchaseTitle>
      <HorizontalLine />
      <CustomerInfoContainer>
        <CustomerInfo>信用卡號碼</CustomerInfo>
        <CustomerInfoInput
          placeholder="**** **** ****"
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleInputChange}
        />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>有效期限</CustomerInfo>
        <CustomerInfoInput placeholder="MM/YY" />
      </CustomerInfoContainer>
      <CustomerInfoContainer>
        <CustomerInfo>安全碼</CustomerInfo>
        <CustomerInfoInput
          placeholder="後三碼"
          type={cvvInputType}
          name="cvv"
          value={formData.cvv}
          onChange={handleInputChange}
          onBlur={handleBlurCvv}
        />
      </CustomerInfoContainer>
      <PaymentContainer>
        <PaymentWordAndMoneyContainer>
          <PaymentInfo>總金額</PaymentInfo>
          <PaymentMoneyContainer>
            <div>NT$</div>
            <PaymentMoney>{totalPrice}</PaymentMoney>
          </PaymentMoneyContainer>
        </PaymentWordAndMoneyContainer>
        <PaymentWordAndMoneyContainer>
          <PaymentInfo>運費</PaymentInfo>
          <PaymentMoneyContainer>
            <div>NT$</div>
            <PaymentMoney>30</PaymentMoney>
          </PaymentMoneyContainer>
        </PaymentWordAndMoneyContainer>

        <HorizontalLine />
        <PaymentWordAndMoneyContainer>
          <PaymentInfo>應付金額</PaymentInfo>
          <PaymentMoneyContainer>
            <div>NT$</div>
            <PaymentMoney>{totalPrice + 30}</PaymentMoney>
          </PaymentMoneyContainer>
        </PaymentWordAndMoneyContainer>
        <ConfirmButton onClick={handlePayment}>確認付款</ConfirmButton>
      </PaymentContainer>
    </div>
  );
}

export default Checkout;
