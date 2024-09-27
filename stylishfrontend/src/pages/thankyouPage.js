import Header from "../component/header/header.js";
import Thankyou from "../component/thankyou/thankyou.tsx";
import Footer from "../component/footer/footer.js";
import styled from "styled-components";

const ThankyouPage = styled.div`
  margin: 0 5rem 30% 5rem;
`;

const ThankyouPageLayout = () => {
  return (
    <div>
      <Header />
      <ThankyouPage>
        <Thankyou />
      </ThankyouPage>
      <Footer />
    </div>
  );
};

export default ThankyouPageLayout;
