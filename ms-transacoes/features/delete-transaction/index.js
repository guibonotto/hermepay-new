const { TYPES } = require('tedious');
const { runQuery } = require('../../infra/db');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "UPDATE transactions SET deletedAt = GETUTCDATE() WHERE id = @id AND deletedAt IS NULL;";
        const params = [{ name: 'id', type: TYPES.Int, value: id }];

        const { rowCount } = await runQuery(query, params);

        if (rowCount === 0) return res.status(404).json({ message: 'Transação não encontrada.' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar', error: error.message });
    }
};