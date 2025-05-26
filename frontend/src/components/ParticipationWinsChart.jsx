import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ParticipationWinsChart = ({ filters }) => {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlot = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/graph/participation-wins-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters),
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.statusText}`);
        }

        const json = await response.json();
        setPlotData(json);
      } catch (error) {
        console.error('Ошибка при получении графика:', error);
        setError(error.message);
        setPlotData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlot();
  }, [filters]);

  if (loading) return <div>Загрузка графика побед и участий...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  return plotData ? (
    <Plot
      data={plotData.data}
      layout={{
        ...plotData.layout,
        autosize: true,
        margin: { t: 50, l: 50, r: 30, b: 50 },
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '500px' }}
      config={{ responsive: true }}
    />
  ) : (
    <div>Нет данных для отображения</div>
  );
};

export default ParticipationWinsChart;
