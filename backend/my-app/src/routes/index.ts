import { Router } from 'express';
import { IndexController } from '../controllers/index';

const router = Router();
const indexController = new IndexController();

export function setRoutes(app) {
    app.use('/api/users', router);
    router.get('/', indexController.getUsers.bind(indexController));
    router.post('/', indexController.createUser.bind(indexController));
}