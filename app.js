import express from 'express';
import CourseRoutes from './Kanbas/courses/routes.js';
import ModuleRoutes from './Kanbas/modules/routes.js';
import Lab5 from './Lab5.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
Lab5(app);
CourseRoutes(app);
ModuleRoutes(app);
app.listen(process.env.port || 4000);
