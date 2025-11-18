const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.isBackendAvailable = false;
    }

    log(...msg) {
        console.log("%c[ApiService]", "color:#4ea1ff; font-weight:bold;", ...msg);
    }

    info(...msg) {
        console.log("%c[Api INFO]", "color:#2ecc71; font-weight:bold;", ...msg);
    }

    warn(...msg) {
        console.warn("%c[Api WARN]", "color:orange; font-weight:bold;", ...msg);
    }

    error(...msg) {
        console.error("%c[Api ERROR]", "color:red; font-weight:bold;", ...msg);
    }

    timeStart(label) {
        console.time(`⏱ ${label}`);
    }

    timeEnd(label) {
        console.timeEnd(`⏱ ${label}`);
    }

    async checkBackendAvailability() {
        const url = "http://localhost:3000/health";

        this.log("🔍 Verificando backend...", url);
        this.timeStart("health-check");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            this.warn("⏳ Timeout ao acessar /health — AbortController acionado");
            controller.abort();
        }, 5000);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json" },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            this.info(`📡 /health respondeu: HTTP ${response.status} - ${response.statusText}`);
            this.timeEnd("health-check");

            if (!response.ok) {
                this.warn("❌ Backend respondeu mas não OK");
                return false;
            }

            this.info("✅ Backend disponível");
            this.isBackendAvailable = true;
            return true;

        } catch (error) {
            clearTimeout(timeoutId);
            this.timeEnd("health-check");

            if (error.name === "AbortError") {
                this.error("⛔ Timeout (AbortError) no health-check");
            } else {
                this.error("💥 Erro ao verificar backend:", error.message);
            }

            this.warn("Backend não disponível:", error);
            this.isBackendAvailable = false;
            return false;
        }
    }

    async get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;

        this.log(`🌐 GET → ${url}`);
        this.timeStart(`GET ${endpoint}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            this.warn("⏳ Timeout em GET — AbortController acionado");
            controller.abort();
        }, 10000);

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            this.info(`📥 HTTP ${response.status} ${response.statusText}`);

            if (!response.ok) {
                this.error(`❌ Erro HTTP GET ${response.status} - ${response.statusText}`);
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            this.info("📘 GET Dados recebidos:", data);
            this.timeEnd(`GET ${endpoint}`);

            return data;

        } catch (error) {
            clearTimeout(timeoutId);
            this.timeEnd(`GET ${endpoint}`);

            if (error.name === "AbortError") {
                this.error("⛔ Timeout no GET");
                throw new Error("Timeout: Servidor não respondeu a tempo");
            }

            if (error.message.includes("Failed to fetch")) {
                this.error("🌐 Failed to fetch → servidor OFFLINE, CORS, porta errada ou firewall");
                throw new Error(
                    "Problema de conexão com o servidor. Verifique se o backend está rodando e configurado para CORS."
                );
            }

            this.error("💥 Erro inesperado no GET:", error);
            throw error;
        }
    }

    async post(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;

        this.log(`📤 POST → ${url}`, "Payload:", data);
        this.timeStart(`POST ${endpoint}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            this.warn("⏳ Timeout em POST — AbortController acionado");
            controller.abort();
        }, 10000);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            this.info(`📥 HTTP ${response.status} ${response.statusText}`);

            if (!response.ok) {
                this.error(`❌ Erro HTTP POST ${response.status} - ${response.statusText}`);
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();

            this.info("📘 POST Resultado:", result);
            this.timeEnd(`POST ${endpoint}`);

            return result;

        } catch (error) {
            clearTimeout(timeoutId);
            this.timeEnd(`POST ${endpoint}`);

            if (error.name === "AbortError") {
                this.error("⛔ Timeout no POST");
                throw new Error("Timeout: Servidor não respondeu a tempo");
            }

            if (error.message.includes("Failed to fetch")) {
                this.error("🌐 Failed to fetch no POST → servidor OFFLINE, CORS ou rota inválida");
            }

            this.error("💥 Erro inesperado no POST:", error);
            throw error;
        }
    }

    async getImplantacaoBase() {
        this.log("📌 Carregando Implantação Base...");
        return this.formatDataForFrontend(await this.get("/simulador/implantacao"), 1);
    }

    async getSubstituicaoBase() {
        this.log("📌 Carregando Substituição Base...");
        return this.formatDataForFrontend(await this.get("/simulador/substituicao"), 2);
    }

    async postImplantacaoRecalculo(data) {
        this.log("📌 Recalculando Implantação...");
        return await this.post("/simulador/implantacao", data);
    }

    async postSubstituicaoRecalculo(data) {
        this.log("📌 Recalculando Substituição...");
        return await this.post("/simulador/substituicao", data);
    }

    async getSimulationData(simulationType) {
        this.log("🎛 Solicitando dados de simulação:", simulationType);

        const isAvailable = await this.checkBackendAvailability();

        if (!isAvailable) {
            this.error("🚫 Backend OFFLINE");
            throw new Error(
                "Backend não está respondendo. Verifique se o servidor está rodando na porta 3000."
            );
        }

        this.info("▶ Backend OK — carregando dados...");

        return simulationType === 1
            ? await this.getImplantacaoBase()
            : await this.getSubstituicaoBase();
    }

    formatDataForFrontend(backendData, simulationType) {
        if (!backendData) return null;

        const formattedData = {
            titulo:
                backendData.titulo ||
                (simulationType === 1
                    ? "Custo de Implantação de Pomar de Cajueiro-anão - 7m x 7m"
                    : "Substituição de Copa de Cajueiro - 10m x 10m"),
            hectaresPlantas: backendData.hectaresPlantas || { qtdPlantas: 204 }
        };

        const mapItems = (arr) =>
            arr.map((item) => ({
                descricao: item.descricao,
                unidade: item.unidade,
                quantidade: item.quantidade || 0,
                valorUnitario: item.valorUnitario || 0,
                qty: item.quantidade || 0,
                unitValue: item.valorUnitario || 0
            }));

        if (simulationType === 1) {
            if (backendData.preparoSolo) formattedData.preparoSolo = mapItems(backendData.preparoSolo);
            if (backendData.insumos) formattedData.insumos = mapItems(backendData.insumos);
        } else {
            if (backendData.preparoArea) formattedData.preparoArea = mapItems(backendData.preparoArea);
            if (backendData.insumos) formattedData.insumos = mapItems(backendData.insumos);
            if (backendData.preparoSolo) formattedData.preparoSolo = mapItems(backendData.preparoSolo);
            if (backendData.servicos) formattedData.servicos = mapItems(backendData.servicos);
        }

        return formattedData;
    }
}

export const apiService = new ApiService();
export default apiService;
