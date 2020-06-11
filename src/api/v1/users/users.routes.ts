import Router from 'koa-router';
import {UsersRouteHandler} from './users-route-handler';

const router = new Router();
const BASE_URL = '/yadu/api/v1/users';

router.get(`${BASE_URL}`, UsersRouteHandler.getUsers);
router.get(`${BASE_URL}/me`, UsersRouteHandler.getCurrentUser);
router.get(`${BASE_URL}/:id`, UsersRouteHandler.getUser);
router.post(`${BASE_URL}`, UsersRouteHandler.addUser);
router.delete(`${BASE_URL}/:id`, UsersRouteHandler.deleteUser);
router.put(`${BASE_URL}/:id`, UsersRouteHandler.updateUser);

export = router;
