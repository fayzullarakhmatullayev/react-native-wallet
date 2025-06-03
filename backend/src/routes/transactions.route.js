import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionSummary
} from '../controllers/transactions.controller.js';

const router = Router();

router.post('/', createTransaction);
router.get('/:userId', getTransactionsByUserId);
router.delete('/:id', deleteTransaction);
router.get('/summary/:userId', getTransactionSummary);

export default router;
