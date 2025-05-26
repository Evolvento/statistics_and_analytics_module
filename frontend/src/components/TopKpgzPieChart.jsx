import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const TopKpgzPieChart = ({ filters }) => {
  const [plotData, setPlotData] = useState(null);

  useEffect(() => {
    const fetchPlot = async () => {
      const response = await fetch('http://localhost:8080/graph/top-kpgz-json', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await response.json();
      setPlotData(json);
    };

    fetchPlot();
  }, [filters]);

  return plotData ? (
    <Plot data={plotData.data} layout={plotData.layout} />
  ) : (
    <div>Загрузка круговой диаграммы...</div>
  );
};

export default TopKpgzPieChart;