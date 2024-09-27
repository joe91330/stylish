const { Upload } = require("@aws-sdk/lib-storage");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const redis = require('redis');
// const client = redis.createClient();
const apiRouter = require("./api");

const express = require("express");

const app = express();
const mysqlPromise = require("mysql2/promise");
const port = 3000;
const swaggerDocument = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require("aws-sdk");
const cors = require('cors');


app.use(cors());



const s3 = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ,
  },
});

require("dotenv").config();
const dbPromise = mysqlPromise.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  (err) => {
    if (err) {
      console.error("Database connection error:", err);
    } else {
      console.log("Database connected successfully");
    }
  }
);

app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());


app.get("/", (req, res) => {
  res.send("Welcome to your API!");
});

app.post(
  "/products",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  async (req, res) => {
    // console.log("req.bodyis", req.body);

    try {
      const {
        category,
        title,
        description,
        price,
        texture,
        wash,
        place,
        note,
        story,
        colors,
        sizes,
        variants,
      } = req.body;

      const mainImage = req.files["main_image"]
        ? req.files["main_image"][0].buffer
        : null;
      const imagePaths = req.files["images"]?.map((file) => file.buffer);

      const requestDate = req.get("request-date");

      const connection = await dbPromise.getConnection();
      // Start a transaction
      await connection.beginTransaction();

      // Insert product
      const sqlProduct = `
        INSERT INTO Product (category, title, description, price, texture, wash, place, note, story,sizes, main_image, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [productResult] = await connection.query(sqlProduct, [
        category,
        title,
        description,
        price,
        texture,
        wash,
        place,
        note,
        story,
        sizes,
        mainImage,
        JSON.stringify(imagePaths),
      ]);

      // console.log("mainImage is", mainImage);
      // console.log("req.files is", req.files["main_image"][0]);

      if (mainImage) {
        const mainImageKey = `products/${productResult.insertId}/main_image`;

        (async () => {
          const command = new PutObjectCommand({
            Bucket: "joe-product-images",
            Key: mainImageKey,
            Body: req.files["main_image"][0].buffer,
            ContentType: req.files["main_image"][0].mimetype,
          });

          try {
            const response = await s3.send(command);
            console.log("Object uploaded:", response);
          } catch (error) {
            console.error("Error uploading object:", error);
          }
        })();

        mainImageURL = `https://joe-product-images.s3.amazonaws.com/${mainImageKey}`;
      }

      const imageUrls = [];
      for (const image of imagePaths || []) {
        const imageKey = `products/${productResult.insertId}/images/${image}`;
        const imageUploadParams = {
          Bucket: "joe-product-images",
          Key: imageKey,
          Body: image,
          ACL: "public-read",
        };

        await new Upload({
          client: s3,
          params: imageUploadParams,
        }).done();

        const imageUrl = `https://joe-product-images.s3.amazonaws.com/${imageKey}`;
        imageUrls.push(imageUrl);
      }

      const colorsArray = JSON.parse(colors);
      const variantArray = JSON.parse(variants);
      console.log("variantArray is", variantArray);

      // Insert color
      for (const color of colorsArray || []) {
        const sqlColor = `INSERT INTO Color (product_id, name, code) VALUES (?, ?, ?)`;
        const [colorResult] = await connection.query(sqlColor, [
          productResult.insertId,
          color.name,
          color.code,
        ]);
      }
      // console.log("variantArray is", variantArray);
      // Insert variant
      for (const variant of variantArray || []) {
        const sqlVariant = `INSERT INTO Variant (product_id, color_code, size, stock) VALUES (?, ?, ?, ?)`;
        const [variantResult] = await connection.query(sqlVariant, [
          productResult.insertId,
          variant.color_code,
          variant.size,
          variant.stock,
        ]);
      }
      // Commit the transaction
      await connection.commit();

      const responseData = {
        data: {
          product: {
            id: productResult.insertId,
            category,
            title,
            description,
            price,
            texture,
            wash,
            place,
            note,
            story,
            main_image: mainImageURL,
            images: imagePaths,
          },
          colors:
            colorsArray?.map((color) => ({
              name: color.name,
              code: color.code,
            })) || [],
          variants:
            variantArray?.map((variant) => ({
              color_code: variant.color_code || null,
              size: variant.size || null,
              stock: variant.stock || null,
            })) || [],

          "request-date": requestDate,
        },
      };

      res.status(200).json(responseData);
    } catch (error) {
      // Rollback the transaction on error
      const connection = await dbPromise.getConnection();
      await connection.rollback();
      console.error("Database error:", error);
      res.status(500).json({ error: "Error inserting data into the database" });
    }
  }
);

const getProductByCategory = async (category, paging = 1) => {
  try {
    const pageSize = 6;
    const offset = (paging - 1) * pageSize;
    const sqlProduct = `
      SELECT *
      FROM Product
      WHERE category = ?
      LIMIT ${offset}, ${pageSize}
    `;
    const [products] = await dbPromise.query(sqlProduct, category);
    console.log("products is", products);
    const result = [];

    for (const product of products) {
      const productId = product.id;
      const sqlColor = `SELECT * FROM Color WHERE product_id = ?`;
      const [colors] = await dbPromise.query(sqlColor, productId);
      console.log("colors is", colors);
      const sqlVariant = `SELECT * FROM Variant WHERE product_id = ?`;
      const [variants] = await dbPromise.query(sqlVariant, productId);
      console.log("variants is", variants);
      result.push({
        ...product,
        colors,
        variants,
      });
      console.log("result is", result);
    }

    let nextPaging = null;
    console.log("products.length is", products.length);
    if (products.length === pageSize) {
      const sqlProduct = `
      SELECT *
      FROM Product
      WHERE category = ?
      LIMIT ${paging * pageSize}, ${pageSize}

    `;
      const [nextpageProduct] = await dbPromise.query(sqlProduct, category);
      console.log("nextpageProduct is", nextpageProduct);
      if (nextpageProduct.length > 0) {
        nextPaging = parseInt(paging) + 1;
      }
    }

    console.log("nextPaging is", nextPaging);
    const response =
      nextPaging !== null
        ? { data: result, next_paging: nextPaging }
        : { data: result };
    return response;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying data from the database");
  }
};

const getProductByTitle = async (titleKeyword, paging = 1) => {
  try {
    const pageSize = 6;
    const offset = (paging - 1) * pageSize;
    const sql = `
      SELECT *
      FROM Product
      WHERE title LIKE ?
      LIMIT ${offset}, ${pageSize}
    `;
    const [products] = await dbPromise.query(sql, [`%${titleKeyword}%`]);
    if (products.length === 0) {
      return ;
    } 

    const result = [];

    for (const product of products) {
      const productId = product.id;
      const sqlColor = `SELECT * FROM Color WHERE product_id = ?`;
      const [colors] = await dbPromise.query(sqlColor, productId);

      const sqlVariant = `SELECT * FROM Variant WHERE product_id = ?`;
      const [variants] = await dbPromise.query(sqlVariant, productId);

      result.push({
        ...product,
        colors,
        variants,
      });
    }

    let nextPaging = null;
    if (products.length === pageSize) {
      const sqlProduct = `
      SELECT *
      FROM Product
      WHERE category = ?
      LIMIT ${paging * pageSize}, ${pageSize}

    `;
      const [nextpageProduct] = await dbPromise.query(sqlProduct, category);
      console.log("nextpageProduct is", nextpageProduct);
      if (nextpageProduct.length > 0) {
        nextPaging = parseInt(paging) + 1;
      }
    }
    const response =
      nextPaging !== null ? { data: result, next_paging } : { data: result };

    return response;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("拿數據發生錯誤");
  }
};

const getProductDetails = async (productId) => {
  try {
    const sql = "SELECT * FROM Product WHERE id = ?";
    const [product] = await dbPromise.query(sql, productId);

    if (product.length > 0) {
      const detailedProduct = product[0];

      const sqlColor = `SELECT * FROM Color WHERE product_id = ?`;
      const [colors] = await dbPromise.query(sqlColor, productId);

      const sqlVariant = `SELECT * FROM Variant WHERE product_id = ?`;
      const [variants] = await dbPromise.query(sqlVariant, productId);

      detailedProduct.colors = colors;
      detailedProduct.variants = variants;

      return detailedProduct;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error querying data from the database");
  }
};

// test code

// const run = async () => {
//   try {
//     const result = await getProductByTitle("all");
//     console.log("result is", result);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// run();

// Build Product List API
app.get("/api/1.0/products/all", async (req, res) => {
  try {
    const category = "all";
    const paging = req.query.paging;
    const result = await getProductByCategory(category, paging);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying data from the database" });
  }
});

app.get("/api/1.0/products/men", async (req, res) => {
  try {
    const category = "men";
    const paging = req.query.paging;
    const result = await getProductByCategory(category, paging);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying data from the database" });
  }
});

app.get("/api/1.0/products/women", async (req, res) => {
  try {
    const category = "women";
    const paging = req.query.paging;
    const result = await getProductByCategory(category, paging);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying data from the database" });
  }
});

app.get("/api/1.0/products/accessories", async (req, res) => {
  try {
    const category = "accessories";
    const paging = req.query.paging;
    const result = await getProductByCategory(category, paging);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying data from the database" });
  }
});

// Build Product Search API
app.get("/api/1.0/products/search", async (req, res) => {
  try {
    const titleKeyword = req.query.keyword;
    const paging = req.query.paging;
    const result = await getProductByTitle(titleKeyword, paging);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying data from the database" });
  }
});

// Get Product detail API

app.get("/api/1.0/products/details", async (req, res) => {
  try {
    const productId = req.query.id;
    const productDetails = await getProductDetails(productId);

    if (productDetails !== null) {
      const responseData = {
        data: productDetails,
      };
      res.status(200).json(responseData);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error querying product details" });
  }
});


// sing up
app.use("/api/1.0",apiRouter);
app.use(express.static(__dirname));



app.listen(port, () => {
  console.log("Server is running on port 3000");
});


