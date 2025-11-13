import React, { useState, useEffect } from 'react';
import SimulationWrapper from '../../components/Charts/SimulationWrapper/SimulationWrapper';
import { apiService } from '../../services/util/apiService';

const Simulacao1 = () => {
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSimulationData(1);
        setSimulationData(data);
      } catch (err) {
        console.error('Erro ao carregar dados da simulação 1:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando dados da simulação...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '16px',
        color: '#d32f2f',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Verifique se o backend está rodando na porta 3000.
          </p>
        </div>
      </div>
    );
  }

  if (!simulationData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        Nenhum dado disponível para simulação.
      </div>
    );
  }

  return (
    <SimulationWrapper
      simulationType={1}
      initialData={simulationData}
      title={simulationData.titulo || "Custo de Implantação de Pomar de Cajueiro-anão - 7m x 7m"}
      icon="tractor"
      columnsConfig={{
        preparoSolo: ['item', 'unit', 'qty', 'unitValue'],
        insumos: ['item', 'unit', 'qty', 'unitValue']
      }}
    />
  );
};

export default Simulacao1;
