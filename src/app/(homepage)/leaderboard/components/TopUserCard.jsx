export default function TopUserCard({ user, podiumPosition, featured = false }) {
    // Función para determinar los colores según el rango
    const getRankColors = (rank) => {
      if (!rank) return 'from-gray-600/20 to-gray-900/30 border-gray-500/30 text-gray-400';
      
      switch (rank.toLowerCase()) {
        case 'elite':
          return 'from-red-600/20 to-red-900/30 border-red-500/30 text-red-400';
        case 'master':
          return 'from-purple-600/20 to-purple-900/30 border-purple-500/30 text-purple-400';
        case 'expert':
          return 'from-blue-600/20 to-blue-900/30 border-blue-500/30 text-blue-400';
        default:
          return 'from-gray-600/20 to-gray-900/30 border-gray-500/30 text-gray-400';
      }
    };
  
    // Verificar que user y sus propiedades existan
    if (!user) {
      return <div className="bg-gray-800/50 rounded-xl p-6 text-white">Usuario no disponible</div>;
    }
  
    // Colores según posición
    const borderColor = podiumPosition === "first" 
      ? "border-yellow-500/60" 
      : podiumPosition === "second" 
        ? "border-gray-400/60" 
        : "border-amber-700/60";
    
    const rankColors = getRankColors(user.rank);
    const position = user.position || 0;
    
    return (
      <div className={`relative flex flex-col items-center bg-gradient-to-b ${rankColors} rounded-xl p-4 border ${borderColor} transition-all duration-300 hover:bg-opacity-30`}>
        {/* Badge de posición */}
        <div className="absolute top-3 right-3 text-xl">
          {user.badge || ''}
        </div>
        
        {/* Número de posición */}
        <div className="absolute top-3 left-3 bg-black/30 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {position}
        </div>
        
        {/* Avatar con tamaño ajustado */}
        <div className="relative mb-3">
          <div className={`${podiumPosition === "first" ? "w-20 h-20" : "w-18 h-18"} rounded-full bg-gray-700 overflow-hidden border-2 ${borderColor}`}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xl font-bold">
                {user.name ? user.name.charAt(0) : '?'}
              </div>
            )}
          </div>
          {podiumPosition === "first" && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl">
              👑
            </div>
          )}
        </div>
        
        {/* Nombre de usuario */}
        <h3 className={`${podiumPosition === "first" ? "text-xl" : "text-lg"} font-bold text-white mb-1 text-center`}>
          {user.name || 'Usuario'}
        </h3>
        
        {/* Badge de rango */}
        {user.rank && (
          <div className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium mb-2 ${rankColors}`}>
            {user.rank}
          </div>
        )}
        
        {/* Puntos */}
        <div className="text-lg font-bold text-white">
          {user.points ? user.points.toLocaleString() : '0'} 
          <span className="text-xs text-mahindra-light-gray ml-1">pts</span>
        </div>
      </div>
    );
  }