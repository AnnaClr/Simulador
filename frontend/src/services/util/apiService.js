const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.isBackendAvailable = false;
    }

    async checkBackendAvailability() {
        try {
            const response = await fetch('http://localhost:3000/health', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                this.isBackendAvailable = true;
                return true;
            }
        } catch (error) {
            this.isBackendAvailable = false;
        }
        return false;
    }

    async get(endpoint) {
        try {            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                throw new Error('Problema de conexão com o servidor. Verifique se o backend está rodando e configurado para CORS.');
            }
            
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async getImplantacaoBase() {
        return await this.get('/simulador/implantacao');
    }

    async getSubstituicaoBase() {
        return await this.get('/simulador/substituicao');
    }

    async postImplantacaoRecalculo(data) {
        return await this.post('/simulador/implantacao', data);
    }

    async postSubstituicaoRecalculo(data) {
        return await this.post('/simulador/substituicao', data);
    }

    async getSimulationData(simulationType) {
        const isAvailable = await this.checkBackendAvailability();
        if (!isAvailable) {
            throw new Error('Backend não está respondendo. Verifique se o servidor está rodando na porta 3000.');
        }

        return simulationType === 1 ? 
            await this.getImplantacaoBase() : 
            await this.getSubstituicaoBase();
    }

    async postRecalculation(simulationType, data) {
        return simulationType === 1 ? 
            await this.postImplantacaoRecalculo(data) : 
            await this.postSubstituicaoRecalculo(data);
    }
}

export const apiService = new ApiService();
export default apiService;