import { sql } from '../config/db.js';

export const getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const transactions = await sql`
        SELECT * FROM transactions
        WHERE user_id = ${userId}
        ORDER BY id DESC
      `;
    res.json(transactions);
  } catch (error) {
    console.error('🚫 Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const createTransaction = async (req, res) => {
  const { user_id, title, amount, category } = req.body;

  try {
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await sql`
          INSERT INTO transactions (user_id, title, amount, category)
          VALUES (${user_id}, ${title}, ${amount}, ${category}) 
          RETURNING *`;

    res.status(201).json(result);
  } catch (error) {
    console.error('🚫 Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction id' });
    }

    const [result] = await sql`
        DELETE FROM transactions
        WHERE id = ${id} 
        RETURNING *
      `;

    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('🚫 Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const getTransactionSummary = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const [balanceResult, incomeResult, expensesResult] = await Promise.all([
      sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `,
      sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `,
      sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `
    ]);

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses
    });
  } catch (error) {
    console.error('🚫 Error fetching transactions summary:', error);
    res.status(500).json({ error: 'Failed to fetch transactions summary' });
  }
};
