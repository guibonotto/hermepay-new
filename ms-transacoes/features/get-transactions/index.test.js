// features/get-transactions/index.test.js
const getTransactions = require('./index');
const db = require('../../infra/db');

// 1. Mockamos (simulamos) o banco de dados
// Isso impede que o teste tente conectar no Azure SQL de verdade
jest.mock('../../infra/db');

describe('Feature: Get Transactions', () => {
    
    it('Deve retornar 401 se não houver storeId no usuário', async () => {
        // Preparação (Arrange)
        const req = { user: {} }; // Usuário sem storeId
        const res = {
            status: jest.fn().mockReturnThis(), // Mock de res.status
            json: jest.fn() // Mock de res.json
        };

        // Ação (Act)
        await getTransactions(req, res);

        // Verificação (Assert)
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Sem loja associada.' });
    });

    it('Deve retornar lista de transações se houver storeId', async () => {
        // Preparação
        const req = { user: { storeId: 'loja-123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Simulamos que o banco retornou 2 transações
        const mockData = [{ id: 1, value: 100 }, { id: 2, value: 200 }];
        db.runQuery.mockResolvedValue({ rows: mockData });

        // Ação
        await getTransactions(req, res);

        // Verificação
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    });
});