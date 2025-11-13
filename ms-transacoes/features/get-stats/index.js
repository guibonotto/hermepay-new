const { TYPES } = require('tedious');
const { runQuery } = require('../../infra/db');

module.exports = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        if (!storeId) return res.status(401).json({ message: 'Sem loja associada.' });

        const query = `
            SELECT COUNT(*) AS pedidosPagos, SUM(value) AS totalVendas
            FROM transactions
            WHERE store_id = @store_id AND status = 'approved' AND deletedAt IS NULL;
        `;
        const params = [{ name: 'store_id', type: TYPES.VarChar, value: storeId }];
        const { rows } = await runQuery(query, params);

        let stats = { pedidosPagos: 0, totalVendas: 0, ticketMedio: 0 };

        if (rows.length > 0 && rows[0].pedidosPagos > 0) {
            const pedidos = parseInt(rows[0].pedidosPagos);
            const total = parseFloat(rows[0].totalVendas);
            stats = {
                pedidosPagos: pedidos,
                totalVendas: total,
                ticketMedio: parseFloat((total / pedidos).toFixed(2))
            };
        }
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erro nas estatísticas', error: error.message });
    }
};