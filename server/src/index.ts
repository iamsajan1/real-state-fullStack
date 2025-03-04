import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";

/* ROUTES IMPORT*/
import tenantRoutes from "./routes/tenantRoutes"
import managerRoutes from "./routes/managerRoutes"
/* CONFIGRATION*/
 dotenv.config();
 const app = express();
 app.use( express.json());
 app.use(helmet());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(cors());
 app.use(morgan("common"));
 app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));


 /* ROUTES*/
app.get('/', (req, res) => {
    res.send("Welcome this is home routes");
});

app.use("/tenants", authMiddleware(["tenant"]),tenantRoutes);
app.use("/managers", authMiddleware(["manager"]),managerRoutes);
 /* server*/
 const port =process.env.PORT ||3002;
app.listen(port,()=>{
    console.log(`Server is running on  port ${port}`);
});
