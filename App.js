//APP.JS FILE
const express = require("express");
const propertyRoute = require('./routes/propertyRoute');
const landRoute = require('./routes/landRoute');
const reviewRoute = require('./routes/reviewRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const activitiesRoute = require('./routes/activitiesRoute');
const blogRoute = require("./routes/blogRoute");
const commentRoute = require("./routes/commentRoute");
const AppError = require("./errors/appError");
const globalErrorHandler = require('./utils/errorController');
const cookieParser = require("cookie-parser")
const cors = require("cors");
const app = express(); 
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const path = require('path');

//implement cookie-parser
app.use(cookieParser())

app.use(express.json())


app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: process.env.originUrl,
    methods: 'GET,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization, api_key',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  
  app.options('*', cors(corsOptions));


//Test route to ensure basic functionality
app.get('/', (req, res) => {
    res.send('API is working');  
});


const swaggerOptions = { 
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PROPERTY MANAGEMENT API(Real Estate API)',
      version: '1.0.0',
      description: `


      The Real Estate API is a comprehensive backend service designed to power a real estate platform, enabling users to explore, manage, and interact with various property listings. This API caters to the needs of both administrators and end-users by providing a wide range of features that facilitate property management, user engagement, and secure transactions. It is built with Node.js and Express.js, with MongoDB as the database, and it integrates various middleware and security features to ensure a smooth and safe user experience.

        FEATURES
        - User Authentication and Authorization: User registration, email verification, and JWT authentication.
        - Property Management: Creating, updating, deleting, and retrieving property listings, including land listings and ordering properties.
        - User Engagement: Review and blog systems with comments.
        - Notification System: Email notifications for orders and password resets.
        - Security Features: CORS configuration, secure cookie handling, and JWT protection.
        - Admin Features: Full control over properties, blogs, and activity logs.


      `,
    },
    servers: [
      { 
        url: process.env.backendUrl || "https://home-features-backend.vercel.app"
      },
    ], 
    components: {
      schemas: {
        Property: {
          type: 'object',
          required: ['name', 'price', 'location', 'images', 'bathroom', 'bedroom', 'status', 'garage', 'yearBuilt', 'type'],
          properties: {
            name: { type: 'string', description: 'Name of the property' },
            price: { type: 'number', description: 'Price of the property' },
            location: { type: 'string', description: 'Location of the property' },
            images: { 
              type: 'array',
              items: { type: 'string' },
              description: 'Images of the property'
            },
            bathroom: { type: 'number', description: 'Number of bathrooms' },
            bedroom: { type: 'number', description: 'Number of bedrooms' },
            status: { type: 'string', description: 'Property status (e.g., available, sold)' },
            garage: { type: 'number', description: 'Number of parking spaces' },
            yearBuilt: { type: 'string', description: 'Year the property was built' },
            type: { type: 'string', description: 'Type of property (e.g., apartment, house)' },
          },
        },
        Users: {},
        Reviews: {},
        Orders: {},
        Activities: {},
        Comments: {},
        Blog: {},
        Land: {}
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

module.exports = swaggerOptions;

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use(
    '/api-docs', 
    express.static('node_modules/swagger-ui-dist/', {index: false}),
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocs)
  );

  // Serve the Swagger UI static assets (CSS, JS, etc.)
app.use('/api-docs', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
app.use('/api-docs/swagger-ui.css', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui.css')));
app.use('/api-docs/swagger-ui-bundle.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-bundle.js')));
app.use('/api-docs/swagger-ui-standalone-preset.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js')));
app.use('/api-docs/swagger-ui-init.js', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist/swagger-ui-init.js')));


//testing the middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware")
    next();
});
 
//ALL ROUTES
app.use("/api/v1/user", userRoute);
app.use("/api/v1/properties", propertyRoute);
app.use("/api/v1/land", landRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/activities', activitiesRoute); 
app.use("/api/v1/comments", commentRoute);


//RETURN ERROR MESSAGE WHEN USER TRIES TO ACCESS ROUTE THAT DOES NOT EXIST
app.all("*", (req, res, next) => {
    next(new AppError("this route does not exist", 404))
})
 
//use the globall error handler
app.use(globalErrorHandler); 

module.exports = app;