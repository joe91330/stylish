import axios from "axios";
// require('dotenv').config();

const elasticIp = "localhost";
const port = "3000";


const GetProductDetail = async (id: number) => {
  try {
    const response = await axios.get(
      `http://${elasticIp}:${port}/api/1.0/products/details`,
      {
        params: {
          id: id,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default GetProductDetail;
