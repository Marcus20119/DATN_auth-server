import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB';
import configStaticFiles from './config/staticFiles';
import initWebRoutes from './routes/routes';

let app = express();

// Config app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Disable CORS
app.use(cors());
app.options('*', cors());

configStaticFiles(app);
initWebRoutes(app);

connectDB();

dotenv.config();
let port = process.env.PORT;

app.listen(port, () => {
  console.log(`App listening on port http:/localhost:${port}`);
});
