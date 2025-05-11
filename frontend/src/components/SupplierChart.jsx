import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import Toolbar from './Toolbar';

const SupplierChart = () => {
  const [chartData, setChartData] = useState(null);
  const [filters, setFilters] = useState({ start: null, end: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.start) params.append('start', filters.start);
      if (filters.end) params.append('end', filters.end);
      if (filters.inn) params.append('inn', filters.inn);
      if (filters.metrics) {
        params.append('metrics', JSON.stringify(filters.metrics));
      }
  
      const response = await fetch(`http://localhost:8080/data_graph?${params}`);
      const data = await response.json();
      const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
  
      setChartData(parsedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Загрузка данных...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!chartData || chartData.length === 0) return <div>Нет данных для отображения</div>;

  const plotData = [
    {
      x: chartData.map(item => item['Год-Месяц']),
      y: chartData.map(item => item['Участия']),
      name: 'Участия',
      mode: 'lines+markers',
      line: { color: '#1f77b4', width: 2 },
      marker: { size: 8 },
    },
    {
      x: chartData.map(item => item['Год-Месяц']),
      y: chartData.map(item => item['Победы']),
      name: 'Победы',
      mode: 'lines+markers',
      line: { color: '#2ca02c', width: 2 },
      marker: { size: 8 },
    }
  ];

  const layout = {
    title: 'Участия и победы поставщика',
    xaxis: { title: 'Месяц', tickangle: 45 },
    yaxis: { title: 'Количество КС' },
    hovermode: 'x unified',
    template: 'plotly_white',
    legend: { orientation: 'h' },
    margin: { t: 80 },
  };

  return (
    <div>
      <Toolbar onApplyFilters={handleFilterApply} />
      <Plot data={plotData} layout={layout} config={{ responsive: true }} />
    </div>
  );
};

export default SupplierChart;