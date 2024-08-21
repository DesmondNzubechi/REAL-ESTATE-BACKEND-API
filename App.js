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

//implement cookie-parser
app.use(cookieParser())

app.use(express.json())


app.use(express.urlencoded({ extended: true }));

  
// app.use(cors({
//     origin: process.env.originUrl,
//     credentials: true
// }))

const corsOptions = {
    origin: process.env.originUrl,
    methods: 'GET,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  
  app.options('*', cors(corsOptions));


// Test route to ensure basic functionality
app.get('/', (req, res) => {
    res.send('API is working');  
});

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


app.all("*", (req, res, next) => {
    next(new AppError("this route does not exist", 404))
})
 

app.use(globalErrorHandler); 

module.exports = app;