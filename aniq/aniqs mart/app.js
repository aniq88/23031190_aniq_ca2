const express = require('express');
const mysql = require('mysql2');
const multer = require('multer')
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create MySQL connection
const connection = mysql.createConnection({
    //host: 'localhost',
    //user: 'root',
    //password: '',
    //database: 'aniq_c237database',
    host:'mysql-aniq.alwaysdata.net.net'
    user:'aniq_created_for_alwaysdata.net'
    password:'Aniq2006_created_for_alwaysdata.net'
    database:'aniq_c237database'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));
// enable static files
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    // Fetch data from MySQL
    connection.query(sql, (error, results) => {
      if (error) {
        console.error('Database query error:', error.message);
        return res.status(500).send('Error Retrieving products');
      }
      // Render HTML page with data
      res.render('index', { products: results });
    });
});

app.get('/product/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query(sql, [productId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving product by ID');
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('product', { product: results[0] });
    } else {
      // If no product with the given ID was found, render a 404 page or handle it accordingly
      res.status(404).send('Product not found');
    }
  });
});

app.get('/addProduct', (req, res) => {
  res.render('addProduct');
});

app.post('/addProduct', upload.single('image'), (req, res) => {
  // Extract product data from the request body
  const { name, quantity, price } = req.body;
  let image;
  if (req.file) {
    image = req.file.filename;
  } else {
    image = null;
  }
  
  const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
  // Insert the new product into the database
  connection.query(sql, [name, quantity, price, image], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error adding product:", error);
      res.status(500).send('Error adding product');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

app.get('/editProduct/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query(sql, [productId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error Retrieving product by ID');
    }
    // Check if any product with the given ID was found
    if (results.length > 0) {
      // Render HTML page with the product data
      res.render('editProduct', { product: results[0] });
    } else {
      // If no product with the given ID was found, render a 404 page or handle it accordingly
      res.status(404).send('Product not found');
    }
  });
});

app.post('/editProduct/:id', upload.single('image'), (req, res) => {
  const productId = req.params.id;
  // Extract product data from the request body
  const { name, quantity, price } = req.body;
  let image = req.body.currentImage;
  if (req.file) {
    image = req.file.filename;
  }

  const sql = 'UPDATE products SET productName = ?, quantity = ?, price = ?, image = ? WHERE productId = ?';
  // Insert the new product into the database
  connection.query(sql, [name, quantity, price, image, productId], (error, results) => {
    if (error) {
      // Handle any error that occurs during the database operation
      console.error("Error updating product:", error);
      res.status(500).send('Error updating product');
    } else {
      // Send a success response
      res.redirect('/');
    }
  });
});

app.get('/deleteProduct/:id', (req, res) => {
  // Extract the product ID from the request parameters
  const productId = req.params.id;
  const sql = 'DELETE FROM products WHERE productId = ?';
  // Fetch data from MySQL based on the product ID
  connection.query(sql, [productId], (error, results) => {
    if (error) {
      console.error('Error deleting product:', error);
      return res.status(500).send('Error deleting product');
    } else {
      res.redirect('/');
    }
  });
});
// Contact page route
app.get('/contact', (req, res) => {
  res.render('contact');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));