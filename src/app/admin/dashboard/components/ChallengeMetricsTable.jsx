import PropTypes from 'prop-types';

export default function ChallengeMetricsTable({ 
  metrics, 
  currentPage = 1,
  pageSize = 5
}) {
  // Función para calcular el número de fila basado en la página actual
  const calculateRowNumber = (index) => {
    return ((currentPage - 1) * pageSize) + index + 1;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              #
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Challenge Name
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Submissions
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Success Rate
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Avg. Points
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((challenge, idx) => {
            // Determine color based on difficulty
            const difficultyColor = 
              challenge.difficulty === "Easy" ? "text-green-400 bg-green-900/30" :
              challenge.difficulty === "Medium" ? "text-yellow-400 bg-yellow-900/30" :
              "text-red-400 bg-red-900/30";
            
            // Calcular el número de fila
            const rowNumber = calculateRowNumber(idx);
            
            return (
              <tr key={challenge.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                <td className="py-3 px-4 text-sm text-red-400 font-semibold">
                  #{rowNumber}
                </td>
                <td className="py-3 px-4 text-sm text-white">
                  {challenge.name}
                </td>
                <td className="py-2 px-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${difficultyColor}`}>
                    {challenge.difficulty}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-white">
                  {challenge.submissions.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-white">
                  {challenge.successRate}%
                </td>
                <td className="py-3 px-4 text-sm text-white">
                  {challenge.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}