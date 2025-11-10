// controllers/storeController.js

const Store = require('../models/Store'); // Importa o Model que acabamos de criar
const crypto = require('crypto'); // Ferramenta do Node para gerar a api_key

// CREATE (Equivalente ao método 'store' do Laravel)
exports.createStore = async (req, res) => {
    try {
        // Pega o 'name' do corpo da requisição
        const { name } = req.body;

        // Validação simples (vamos melhorar depois)
        if (!name) {
            return res.status(400).json({ message: 'O nome é obrigatório.' });
        }

        // Gera a API Key (equivalente ao Str::random(40))
        const apiKey = crypto.randomBytes(20).toString('hex');

        // Cria a nova loja (equivalente ao Store::create())
        const newStore = await Store.create({
            name: name,
            api_key: apiKey
        });

        // Retorna 201 Created (igual ao Laravel)
        res.status(201).json(newStore);

    } catch (error) {
        // Se der erro (ex: nome duplicado), retorna um erro 500
        res.status(500).json({ message: 'Erro ao criar loja', error: error.message });
    }
};

// READ ALL (Equivalente ao método 'index' do Laravel)
exports.getAllStores = async (req, res) => {
    try {
        // Equivalente ao Store::all()
        // Usamos .find() para buscar (o 'pre' no model já filtra os deletados)
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar lojas', error: error.message });
    }
};
exports.getStoreById = async (req, res) => {
    try {
        // 1. Pega o ID dos parâmetros da URL
        const { id } = req.params;

        // 2. Busca no banco pelo ID (equivalente ao Store::find())
        // O 'pre' no model já filtra se estiver deletado
        const store = await Store.findById(id);

        // 3. Se não encontrar, retorna 404 (Not Found)
        if (!store) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        // 4. Se encontrar, retorna 200 OK com os dados da loja
        res.status(200).json(store);

    } catch (error) {
        // Se o ID for inválido (ex: não for um formato do MongoDB)
        res.status(500).json({ message: 'Erro ao buscar loja', error: error.message });
    }
};
exports.updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; // Por enquanto, só permitimos atualizar o nome

        if (!name) {
            return res.status(400).json({ message: 'O nome é obrigatório.' });
        }

        // 1. Busca e atualiza o documento ao mesmo tempo
        // { new: true } garante que ele retorne o documento *depois* de atualizado
        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { name: name },
            { new: true, runValidators: true } // runValidators força a checagem do schema
        );

        if (!updatedStore) {
            return res.status(404).json({ message: 'Loja não encontrada para atualização.' });
        }

        res.status(200).json(updatedStore);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar loja', error: error.message });
    }
};
exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Em vez de deletar, nós atualizamos o campo 'deletedAt'
        const deletedStore = await Store.findByIdAndUpdate(
            id,
            { deletedAt: new Date() } // Define a data de exclusão para agora
        );

        if (!deletedStore) {
            return res.status(404).json({ message: 'Loja não encontrada para deletar.' });
        }

        // 2. Retorna 204 No Content (padrão de sucesso para DELETE)
        res.status(204).send(); // .send() envia uma resposta sem corpo

    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar loja', error: error.message });
    }
};
// LISTAR contas bancárias de UMA loja
exports.getBankAccounts = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID da loja pela URL

        // Busca a loja pelo ID e seleciona *apenas* o campo bankAccounts
        const store = await Store.findById(id).select('bankAccounts');

        if (!store) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        // Retorna a lista de contas bancárias
        res.status(200).json(store.bankAccounts);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar contas bancárias', error: error.message });
    }
};

// ADICIONAR uma nova conta bancária a UMA loja
exports.addBankAccount = async (req, res) => {
    try {
        const { id } = req.params; // Pega o ID da loja pela URL
        
        // Pega os dados da nova conta do corpo da requisição
        const { ownerName, bankName, agency, accountNumber, accountType } = req.body;

        // Validação básica
        if (!ownerName || !bankName || !agency || !accountNumber || !accountType) {
            return res.status(400).json({ message: 'Todos os campos da conta são obrigatórios.' });
        }

        const newAccount = {
            ownerName,
            bankName,
            agency,
            accountNumber,
            accountType
        };

        // Encontra a loja pelo ID e "empurra" (push) a nova conta para o array bankAccounts
        // { new: true } garante que ele retorne a loja *depois* de atualizada
        const updatedStore = await Store.findByIdAndUpdate(
            id,
            { $push: { bankAccounts: newAccount } }, // O comando Mágico do MongoDB!
            { new: true, runValidators: true }
        );

        if (!updatedStore) {
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }

        // Retorna a conta recém-criada (a última do array)
        res.status(201).json(updatedStore.bankAccounts.pop());

    } catch (error) {
        // Se a validação do Mongoose falhar (ex: 'accountType' inválido)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erro de validação', error: error.message });
        }
        res.status(500).json({ message: 'Erro ao adicionar conta bancária', error: error.message });
    }
};