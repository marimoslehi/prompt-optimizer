import express from 'express';
import { setRoutes } from './routes/index';
import { json } from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});