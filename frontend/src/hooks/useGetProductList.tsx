import axios from "axios";
// require('dotenv').config();

const elasticIp = "localhost";
const port = "3000";

const GetProductList = async (category: string = "all", page: string = "1") => {
  try {
    const response = await axios.get(
      `http://${elasticIp}:${port}/api/1.0/products/${category}`,
      {
        params: {
          paging: page,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default GetProductList;
