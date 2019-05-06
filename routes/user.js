import express from 'express';
import { userController } from '../controllers';
import AuthAdmin from '../utils/auth_admin';

const router = express.Router();

router.use(AuthAdmin);

router.get('/', AuthAdmin, (req, res) => {
  userController.get(req, res);
});

router.get('/:id', AuthAdmin, (req, res) => {
  userController.find(req, res);
});

router.patch('/:id', AuthAdmin, (req, res) => {
  userController.update(req, res);
});

router.delete('/:id', AuthAdmin, (req, res) => {
  userController.delete(req, res);
});

module.exports = router;
