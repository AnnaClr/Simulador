import React from 'react';
import SimulationWrapper from '../../components/Charts/SimulationWrapper/SimulationWrapper';
import { 
  preparoAreaData, 
  insumosData, 
  preparoSoloData, 
  servicosData 
} from '../../services/util/simulationData2';

const Simulacao2 = () => (
  <SimulationWrapper
    simulationType={2}
    initialData={{
      preparoArea: preparoAreaData,
      insumos: insumosData,
      preparoSolo: preparoSoloData,
      servicos: servicosData
    }}
    title="Substituição de Copa de Cajueiro - 10m x 10m"
    icon="tractor"
    columnsConfig={{
      preparoArea: ['item', 'unit', 'qty', 'unitValue'],
      insumos: ['item', 'unit', 'qty', 'unitValue'],
      preparoSolo: ['item', 'unit', 'qty', 'unitValue'],
      servicos: ['item', 'unit', 'qty', 'unitValue']
    }}
  />
);

export default Simulacao2;