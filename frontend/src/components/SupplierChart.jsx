import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const SupplierChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/data_graph');
        const data = await response.json();
        
        // Парсим JSON строку, если backend возвращает строку вместо объекта
        const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        
        setChartData(parsedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка данных...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!chartData) return <div>Нет данных для отображения</div>;

  // Подготовка данных для графика
  const plotData = [
    {
      x: chartData.map(item => item['Год-Месяц']),
      y: chartData.map(item => item['Участия']),
      name: 'Участия',
      mode: 'lines+markers',
      line: { color: '#1f77b4', width: 2 },
      marker: { size: 8 },
      hovertemplate: '%{x}<br>Участия: %{y}<extra></extra>'
    },
    {
      x: chartData.map(item => item['Год-Месяц']),
      y: chartData.map(item => item['Победы']),
      name: 'Победы',
      mode: 'lines+markers',
      line: { color: '#2ca02c', width: 2 },
      marker: { size: 8 },
      hovertemplate: '%{x}<br>Победы: %{y}<extra></extra>'
    }
  ];

  const layout = {
    title: 'Участия и победы поставщика ООО "КОМПЬЮЦЕНТР"',
    xaxis: {
      title: 'Месяц',
      tickangle: 45,
      nticks: Math.min(20, chartData.length),
      tickformat: '%Y-%m'
    },
    yaxis: {
      title: 'Количество котировочных сессий'
    },
    hovermode: 'x unified',
    template: 'plotly_white',
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1
    },
    margin: { t: 80 }
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default SupplierChart;