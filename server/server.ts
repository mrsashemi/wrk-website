import express, {Express} from 'express'; // require express framework
import path from 'path'; // path provides a way of working with directories and file paths
import cors from "cors"; // use cross-origin resource sharing to have the frontend communicate with the backend server 
import cookieParser from 'cookie-parser'; // use to parse cookies from frontend
require('dotenv').config(); // use dotenv

const app: Express = express();
const port = process.env.PORT;

//middleware
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))
app.use('/', express.static(path.join(__dirname, '/public')));


//routes
const images = require("./routers/images");

app.use("/img", images);

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;