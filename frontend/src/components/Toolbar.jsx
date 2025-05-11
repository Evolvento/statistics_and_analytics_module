import React, { useState } from 'react';

const Toolbar = ({ onApplyFilters }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedINN, setSelectedINN] = useState('7721663977');
  const [metrics, setMetrics] = useState({
    participations: true,
    wins: true
  });

  const handleApply = () => {
    onApplyFilters({
      start: startDate,
      end: endDate,
      inn: selectedINN,
      metrics: metrics
    });
  };

  const handleMetricChange = (e) => {
    setMetrics(prev => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div>
        <label>Поставщик: </label>
        <select value={selectedINN} onChange={e => setSelectedINN(e.target.value)}>
          <option value="7721663977">ООО "КОМПЬЮЦЕНТР"</option>
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Начало периода: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label style={{ marginLeft: '10px' }}>Конец периода: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Метрики:</label>
        <label style={{ marginLeft: '10px' }}>
          <input type="checkbox" name="participations" checked={metrics.participations} onChange={handleMetricChange} />
          Участия
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input type="checkbox" name="wins" checked={metrics.wins} onChange={handleMetricChange} />
          Победы
        </label>
      </div>

      <button style={{ marginTop: '10px' }} onClick={handleApply}>Показать</button>
    </div>
  );
};

export default Toolbar;
