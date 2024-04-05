import { Router } from 'express';

import accessMiddleware from '../middlewares/accessMiddleware';

// import AuthController from '../controllers/authController';
// import TweetController from '../controllers/tweetControllers';
import UserController from '../controllers/userController';
// import SearchController from '../controllers/searchController';

import { signUpSchema, logInSchema } from '../middlewares/validations/authValidations.js';
import handleValidationErrors from '../middlewares/validations/handleValidationErrors.js';
import CommitteeController from '../controllers/committeeController.js';
import OpeningController from '../controllers/openingController.js';


const route = Router();

route.get('/', (req, res) => {
  res.status(200).json('Welcome to EARS APP');
});

route.post('/user/signup',  signUpSchema, handleValidationErrors, UserController.signUp);
route.post('/user/login', logInSchema, handleValidationErrors, UserController.logIn);
route.get('/user', accessMiddleware.authoriseUser, UserController.getAllUsers);
route.get('/user/:id', accessMiddleware.authoriseUser, UserController.getUser);
route.put('/user/toggleAccess/:id', accessMiddleware.authoriseUser, UserController.toggleUserAccess);
route.put('/user/:id', accessMiddleware.authoriseUser, UserController.updateUser);

route.post('/committee', accessMiddleware.authoriseUser, CommitteeController.createCommittee);
route.get('/committee', CommitteeController.getCommittee);
route.put('/committee/:id', accessMiddleware.authoriseUser, CommitteeController.updateCommittee);

route.post('/opening', accessMiddleware.authoriseUser, OpeningController.createOpening);
route.get('/opening', accessMiddleware.authoriseUser, OpeningController.getAllOpenings);
route.get('/opening/:id', accessMiddleware.authoriseUser, OpeningController.getOpening);
route.put('/opening/:id', accessMiddleware.authoriseUser, OpeningController.updateOpening);
route.get('/opening/:openingId/application/:applicationId', accessMiddleware.authoriseUser, OpeningController.getApplication);
route.post('/opening/apply/:id', accessMiddleware.authoriseUser, OpeningController.applyOpening);
route.post('/opening/:openingId/review/:applicationId', accessMiddleware.authoriseUser, OpeningController.reviewApplication);

export default route;
