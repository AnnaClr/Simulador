import React from 'react';
import SimulationWrapper from '../../components/Charts/SimulationWrapper/SimulationWrapper';
import { preparoSoloData, insumosData } from '../../services/util/simulationData1';

const Simulacao1 = () => (
  <SimulationWrapper
    simulationType={1}
    initialData={{
      preparoSolo: preparoSoloData,
      insumos: insumosData
    }}
    title="Custo de Implantação de Pomar de Cajueiro-anão - 7m x 7m"
    icon="tractor"
    columnsConfig={{
      preparoSolo: ['item', 'unit', 'qty', 'unitValue'],
      insumos: ['item', 'unit', 'qty', 'unitValue']
    }}
  />
);

export default Simulacao1;