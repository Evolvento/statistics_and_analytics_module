import React, { useState, useEffect } from 'react';
import './App.css';

import ParticipationWinsChart from './components/ParticipationWinsChart';
import TopKpgzPieChart from './components/TopKpgzPieChart';

const App = () => {
  const [filters, setFilters] = useState({
    qsPeriodFrom: '',
    qsPeriodTo: '',
    initialPriceFrom: '0',
    initialPriceTo: '9999999',
    finalPriceFrom: '0',
    finalPriceTo: '9999999',
    quotationSessions: [],
    clients: [],
    kpgz: [],
    ste: [],
    winsParticipations: false,
    offerPeriodFrom: '',
    offerPeriodTo: '',
  });

  const [filterOptions, setFilterOptions] = useState({
    quotation_sessions: [],
    clients: [],
    kpgz: [],
    ste: []
  });

  const [chartHtml, setChartHtml] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/filter-options')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched filter options:', data);

        setFilterOptions({
          quotation_sessions: data.quotation_sessions,
          clients: data.clients,
          kpgz: data.kpgz,
          ste: data.ste,
        });
      })
      .catch(console.error);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, selectedOptions } = e.target;
    const selected = Array.from(selectedOptions, option => option.value);
    setFilters(prev => ({
      ...prev,
      [name]: selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChartHtml(`
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h3>График будет отображаться здесь</h3>
        <p>Переданные параметры фильтров:</p>
        <pre>${JSON.stringify(filters, null, 2)}</pre>
      </div>
    `);
  };

  return (
    <div className="app-container">
      <div className="filters-container">
        <h2 style={{color: '#000000'}}>Общие фильтры</h2>

        <form onSubmit={handleSubmit}>
          <div className="filter-group">
            <label>Период КС</label>
            <div className="date-range">
              <input type="text" name="qsPeriodFrom" value={filters.qsPeriodFrom} onChange={handleInputChange} placeholder="ДД.ММ.ГГГГ" />
              <span>до</span>
              <input type="text" name="qsPeriodTo" value={filters.qsPeriodTo} onChange={handleInputChange} placeholder="ДД.ММ.ГГГГ" />
            </div>
          </div>

          <div className="filter-group">
            <label>Начальная цена КС</label>
            <div className="price-range">
              <input type="text" name="initialPriceFrom" value={filters.initialPriceFrom} onChange={handleInputChange} />
              <span>до</span>
              <input type="text" name="initialPriceTo" value={filters.initialPriceTo} onChange={handleInputChange} />
            </div>
          </div>

          <div className="filter-group">
            <label>Конечная цена КС</label>
            <div className="price-range">
              <input type="text" name="finalPriceFrom" value={filters.finalPriceFrom} onChange={handleInputChange} />
              <span>до</span>
              <input type="text" name="finalPriceTo" value={filters.finalPriceTo} onChange={handleInputChange} />
            </div>
          </div>

          <div className="filter-group">
            <label>Котировочные сессии</label>
            <select
              multiple
              name="quotationSessions"
              value={filters.quotationSessions}
              onChange={handleMultiSelectChange}
            >
              {filterOptions.quotation_sessions.map(option => (
                <option key={option.toString()} value={option.toString()}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Заказчики</label>
            <select
              multiple
              name="clients"
              value={filters.clients}
              onChange={handleMultiSelectChange}
            >
              {filterOptions.clients.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>КПГЗ</label>
            <select multiple name="kpgz" value={filters.kpgz} onChange={handleMultiSelectChange}>
              {filterOptions.kpgz.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>СТЕ</label>
            <select multiple name="ste" value={filters.ste} onChange={handleMultiSelectChange}>
              {filterOptions.ste.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="winsParticipations" checked={filters.winsParticipations} onChange={handleInputChange} />
              Только победы
            </label>
          </div>

          <div className="filter-group">
            <label>Период оферты</label>
            <div className="date-range">
              <input type="text" name="offerPeriodFrom" value={filters.offerPeriodFrom} onChange={handleInputChange} placeholder="ММ.ДД.ГГГГ" />
              <span>до</span>
              <input type="text" name="offerPeriodTo" value={filters.offerPeriodTo} onChange={handleInputChange} placeholder="ММ.ДД.ГГГГ" />
            </div>
          </div>

          <button type="submit" className="apply-button">Применить фильтры</button>
        </form>
      </div>

      <div className="charts-container">
        <ParticipationWinsChart filters={filters} />
        <TopKpgzPieChart filters={filters} />
      </div>
    </div>
  );
};

export default App;
