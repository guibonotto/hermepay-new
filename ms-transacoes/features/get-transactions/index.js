const { TYPES } = require('tedious');
const { runQuery } = require('../../infra/db');

module.exports = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        if (!storeId) return res.status(401).json({ message: 'Sem loja associada.' });

        const query = "SELECT * FROM transactions WHERE store_id = @store_id AND deletedAt IS NULL;";
        const params = [{ name: 'store_id', type: TYPES.VarChar, value: storeId }];
        
        const { rows } = await runQuery(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar transações', error: error.message });
    }
};