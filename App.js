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
const swaggerUi = require('swagger-ui-express');


//implement cookie-parser
app.use(cookieParser())

app.use(express.json())


app.use(express.urlencoded({ extended: true }));

   

const corsOptions = {
    origin: process.env.originUrl,
    methods: 'GET,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  
  app.options('*', cors(corsOptions));


// Test route to ensure basic functionality
// app.get('/', (req, res) => {
//     res.send('API is working');  
// });

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate API',
      version: '1.0.0',
      description: 'API for managing properties, users, orders, and blogs in a real estate platform',
    },
    servers: [
      { 
        url: process.env.backendUrl || 'http://localhost:5000', // Fallback to localhost if env variable isn't set
      },
    ],
    components: {
      schemas: {
        Property: {
          type: 'object',
          required: ['name', 'price', 'location', 'images', 'bathroom', 'bedroom', 'status', 'garage', 'yearBuilt', 'type'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the property',
            },
            price: {
              type: 'number',
              description: 'Price of the property',
            },
            location: {
              type: 'string',
              description: 'Location of the property',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Images of the property',
            },
            bathroom: {
              type: 'number',
              description: 'Number of bathrooms',
            },
            bedroom: {
              type: 'number',
              description: 'Number of bedrooms',
            },
            status: {
              type: 'string',
              description: 'Property status (e.g., available, sold)',
            },
            garage: {
              type: 'number',
              description: 'Number of parking spaces',
            },
            yearBuilt: {
              type: 'string',
              description: 'Year the property was built',
            },
            type: {
              type: 'string',
              description: 'Type of property (e.g., apartment, house)',
            },
          },
        },
        Users : {},
        Reviews: {},
        Orders: {}
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use(
    '/', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocs)
  );

//testing the middleware
app.use((req, res, next) => {
    console.log("Hello from the middleware")
    next();
});
 
//ALL ROUTES
app.use("/api/v1/properties", propertyRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/land", landRoute);
app.use("/api/v1/user", userRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/activities', activitiesRoute); 
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comments", commentRoute);


//RETURN ERROR MESSAGE WHEN USER TRIES TO ACCESS ROUTE THAT DOES NOT EXIST
app.all("*", (req, res, next) => {
    next(new AppError("this route does not exist", 404))
})
 
//use the globall error handler
app.use(globalErrorHandler); 

module.exports = app;