import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function MetricCard({ title, value, icon, change, trend, color }) {
  // Configurar colores según la propiedad color
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return {
          icon: 'bg-red-900/30 text-red-500',
          trend: trend === 'up' ? 'text-green-400' : 'text-red-400'
        };
      case 'blue':
        return {
          icon: 'bg-blue-900/30 text-blue-500',
          trend: trend === 'up' ? 'text-green-400' : 'text-red-400'
        };
      case 'purple':
        return {
          icon: 'bg-purple-900/30 text-purple-500',
          trend: trend === 'up' ? 'text-green-400' : 'text-red-400'
        };
      case 'green':
        return {
          icon: 'bg-green-900/30 text-green-500',
          trend: trend === 'up' ? 'text-green-400' : 'text-red-400'
        };
      default:
        return {
          icon: 'bg-gray-900/30 text-gray-500',
          trend: trend === 'up' ? 'text-green-400' : 'text-red-400'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="font-medium text-sm text-gray-400">{title}</div>
        <div className={`rounded-lg p-2 ${colorClasses.icon}`}>
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-white mb-2">{value}</div>
      
      <div className="flex items-center">
        {trend === 'up' ? (
          <ArrowUpIcon className="h-4 w-4 mr-1 text-green-400" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1 text-red-400" />
        )}
        <span className={`text-xs ${colorClasses.trend}`}>{change}</span>
      </div>
    </div>
  );
}