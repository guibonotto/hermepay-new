// utils/proxyHelpers.js
function handleAxiosError(error, res) {
    if (error.response) {
        // O microserviço respondeu com um erro (404, 500, 401)
        res.status(error.response.status).json(error.response.data);
    } else {
        // Erro de rede (serviço offline)
        console.error('Erro de rede no proxy:', error.message);
        res.status(503).json({ message: 'Um serviço interno está indisponível.' }); // 503 Service Unavailable
    }
}

module.exports = { handleAxiosError };