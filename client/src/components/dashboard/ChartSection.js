// components/dashboard/ChartsSection.js
import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import './ChartSection.css';

const ChartsSection = ({ 
  skills, 
  practiceHistory, 
  getConfidenceTrendData, 
  getPracticeTimeData, 
  getSkillDistributionData, 
  getDecayStatusData 
}) => {
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  return (
    <section className="charts-section1">
      <div className="charts-grid1">
        {/* Confidence Trend Chart */}
        <div className="chart-card1">
          <h3>📈 Confidence Trend (Last 7 Days)</h3>
          <div className="chart-container1" style={{ height: '250px' }}>
            <Line data={getConfidenceTrendData()} options={lineChartOptions} />
          </div>
        </div>

        {/* Practice Time Chart */}
        <div className="chart-card1">
          <h3>⏱️ Practice Time (Last 7 Days)</h3>
          <div className="chart-container1" style={{ height: '250px' }}>
            <Bar data={getPracticeTimeData()} options={barChartOptions} />
          </div>
        </div>

        {/* Skill Distribution Chart */}
        <div className="chart-card1">
          <h3>📊 Skills by Category</h3>
          <div className="chart-container1" style={{ height: '250px' }}>
            {skills.length > 0 ? (
              <Doughnut data={getSkillDistributionData()} options={doughnutOptions} />
            ) : (
              <p className="no-data">No skills tracked yet</p>
            )}
          </div>
        </div>

        {/* Decay Status Chart */}
        <div className="chart-card1">
          <h3>🎯 Skill Status Overview</h3>
          <div className="chart-container1" style={{ height: '250px' }}>
            {skills.length > 0 ? (
              <Doughnut data={getDecayStatusData()} options={doughnutOptions} />
            ) : (
              <p className="no-data">No skills tracked yet</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;