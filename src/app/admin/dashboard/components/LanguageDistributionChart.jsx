import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LanguageDistributionChart = ({ data }) => {
  // Function to get color based on language name - darker tech-vibe colors
  const getColorForLanguage = (languageName) => {
    switch (languageName) {
      case 'JavaScript':
        return '#d97706'; // Dark amber/orange - tech energy
      case 'Python':
        return '#0891b2'; // Dark cyan - deep tech blue
      case 'C++':
        return '#be185d'; // Dark magenta/pink - bold tech accent
      default:
        return '#7c3aed'; // Dark purple for any other language
    }
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getColorForLanguage(entry.label)} 
            />
          ))}
        </Pie>
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle"
          wrapperStyle={{ color: '#fff' }}
        />
      </PieChart>
    </ResponsiveContainer>
    </div>
  );
};

export default LanguageDistributionChart;