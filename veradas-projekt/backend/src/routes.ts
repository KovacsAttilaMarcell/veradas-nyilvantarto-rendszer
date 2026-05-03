import { Router } from 'express';
import { activateLocation, createLocation, deactivateLocation, getAllLocations, 
} from './controller/location.controller';
import { getAllDonors, createDonor, } from './controller/donor.controller';
import { createDonation, getAllDonations, } from './controller/donation.controller';
import { login, register } from './controller/user.controller';
import { protectRoutes } from './protect-routes';

const router = Router();

router.get('/locations', getAllLocations);
router.post('/locations', protectRoutes, createLocation);
router.patch('/locations/:id/activate', protectRoutes, activateLocation);
router.patch('/locations/:id/deactivate', protectRoutes, deactivateLocation);
router.get('/donors', getAllDonors);
router.post('/donors', protectRoutes, createDonor);
router.get('/donations', getAllDonations);
router.post('/donations', protectRoutes, createDonation);
router.post('/auth/register', register);
router.post('/auth/login', login);


export default router;