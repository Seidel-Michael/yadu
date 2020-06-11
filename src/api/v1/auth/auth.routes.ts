import Router from 'koa-router';
import {AuthRouteHandler} from './auth-route-handler';

const router = new Router();
const BASE_URL = '/yadu/api/v1/auth';

// router.patch(`${BASE_URL}/`, AuthRouteHandler.changePassword);
router.post(`${BASE_URL}/login`, AuthRouteHandler.login);
router.get(`${BASE_URL}/login`, AuthRouteHandler.isLoggedIn);
router.post(`${BASE_URL}/logout`, AuthRouteHandler.logout);
// router.get(`${BASE_URL}/currentUser`, AuthRouteHandler.getCurrentUser);

export = router;
