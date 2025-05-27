import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const normalizeFilters = (filters) => {
  return {
    date_qs: filters.qsPeriodFrom || filters.qsPeriodTo
      ? {
          start: filters.qsPeriodFrom,
          end: filters.qsPeriodTo,
        }
      : null,

    starting_price: filters.initialPriceFrom || filters.initialPriceTo
      ? {
          min: filters.initialPriceFrom,
          max: filters.initialPriceTo,
        }
      : null,

    final_price: filters.finalPriceFrom || filters.finalPriceTo
      ? {
          min: filters.finalPriceFrom,
          max: filters.finalPriceTo,
        }
      : null,

    quotation_sessions: filters.quotationSessions.length > 0
      ? filters.quotationSessions
      : null,

    clients: filters.clients.length > 0 ? filters.clients : null,
    kpgz: filters.kpgz.length > 0 ? filters.kpgz : null,
    ste: filters.ste.length > 0 ? filters.ste : null,

    date_offer: filters.offerPeriodFrom || filters.offerPeriodTo
      ? {
          start: filters.offerPeriodFrom,
          end: filters.offerPeriodTo,
        }
      : null,

    only_win: filters.winsParticipations || false,
  };
};


const ParticipationWinsChart = ({ filters }) => {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlot = async () => {
      const normalized = normalizeFilters(filters);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/graph/participation-wins-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalized),
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
