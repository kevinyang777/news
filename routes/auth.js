import express from 'express';
import { authController } from '../controllers';

const router = express.Router();

router.post('/register', (req, res) => {
  authController.register(req, res);
});

router.post('/getToken', (req, res) => {
  authController.generateToken(req, res);
});

router.post('/refreshToken', (req, res) => {
  authController.regenerateToken(req, res);
});

module.exports = router;
