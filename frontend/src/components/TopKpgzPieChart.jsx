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

const TopKpgzPieChart = ({ filters }) => {
  const [plotData, setPlotData] = useState(null);

  useEffect(() => {
    const fetchPlot = async () => {
      const normalized = normalizeFilters(filters);
      const response = await fetch('http://localhost:8080/graph/top-kpgz-json', {
        method: 'POST',
        body: JSON.stringify(normalized),
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