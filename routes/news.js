import express from 'express';
import { newsController } from '../controllers';

// import AuthUser from '../utils/auth_user';
import AuthAdmin from '../utils/auth_admin';

const router = express.Router();

router.get('/', (req, res) => {
  newsController.get(req, res);
});

router.get('/:id', (req, res) => {
  newsController.find(req, res);
});

router.post('/', AuthAdmin, (req, res) => {
  newsController.create(req, res);
});

router.patch('/:id', AuthAdmin, (req, res) => {
  newsController.update(req, res);
});

router.delete('/:id', AuthAdmin, (req, res) => {
  newsController.delete(req, res);
});

module.exports = router;
