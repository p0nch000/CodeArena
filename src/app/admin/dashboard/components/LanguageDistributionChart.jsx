import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LanguageDistributionChart = ({ data }) => {
  // Colores más suaves para el gráfico
  const colors = [
    '#e34142', // rojo rosado oscuro
    '#397dec', // azul oscuro
    '#E6B000', // amarillo dorado
    '#21bc5b', // turquesa oscuro
    '#9a4ee3', // morado oscuro
    '#CC7A00',  // gris
  ];

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
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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