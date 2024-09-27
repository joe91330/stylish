import axios from "axios";
// require('dotenv').config();

// const elasticIp = process.env.ELASTIC_IP || "localhost";
const elasticIp =  "localhost";
const port = "3000";


const GetProductSearch = async (keyword: string, page: string = "1") => {
  try {
    const response = await axios.get(
      `http://${elasticIp}:${port}/api/1.0/products/search`,
      {
        params: {
          keyword: keyword,
          paging: page,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default GetProductSearch;
