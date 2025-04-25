export default function TopUserCard({ user, podiumPosition, featured = false }) {
    const getRankColors = (rank) => {
      if (!rank) return 'from-gray-600/20 to-gray-900/30 border-gray-500/30 text-gray-400';
      
      const rankLower = rank.toLowerCase();
      
      if (rankLower.includes('elite') || rankLower.includes('codebreaker'))
        return 'from-red-600/20 to-red-900/30 border-red-500/30 text-yellow-400';
      if (rankLower.includes('diamond') || rankLower.includes('debugger'))
        return 'from-purple-600/20 to-purple-900/30 border-purple-500/30 text-pink-500';
      if (rankLower.includes('platinum') || rankLower.includes('architect'))
        return 'from-blue-600/20 to-blue-900/30 border-blue-500/30 text-blue-400';
      if (rankLower.includes('gold') || rankLower.includes('engineer'))
        return 'from-yellow-600/20 to-yellow-900/30 border-yellow-500/30 text-yellow-400';
      if (rankLower.includes('silver') || rankLower.includes('developer'))
        return 'from-gray-400/20 to-gray-700/30 border-gray-400/30 text-gray-300';
      if (rankLower.includes('bronze') || rankLower.includes('coder'))
        return 'from-amber-600/20 to-amber-900/30 border-amber-500/30 text-amber-500';
      
      return 'from-gray-600/20 to-gray-900/30 border-gray-500/30 text-gray-400';
    };
  
    const getRankBadgeImage = (rank) => {
      if (!rank) return null;
      
      const rankLower = rank.toLowerCase();
      
      if (rankLower.includes('elite') || rankLower.includes('codebreaker'))
        return '/AssetEliteBadge.png';
      if (rankLower.includes('diamond') || rankLower.includes('debugger'))
        return '/AssetDiamondBadge.png';
      if (rankLower.includes('platinum') || rankLower.includes('architect'))
        return '/AssetPlatinumBadge.png';
      if (rankLower.includes('gold') || rankLower.includes('engineer'))
        return '/AssetGoldBadge.png';
      if (rankLower.includes('silver') || rankLower.includes('developer'))
        return '/AssetSilverBadge.png';
      if (rankLower.includes('bronze') || rankLower.includes('coder'))
        return '/AssetBronzeBadge.png';
      
      return null;
    };
  
    // Verificar que user y sus propiedades existan
    if (!user) {
      return (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center text-gray-400 h-full flex items-center justify-center">
          <div className="animate-pulse">Loading top players...</div>
        </div>
      );
    }
  
    // Colores según posición
    const borderColor = podiumPosition === "first" 
      ? "border-yellow-500/60" 
      : podiumPosition === "second" 
        ? "border-gray-400/60" 
        : "border-amber-700/60";
    
    const rankColors = getRankColors(user.rank);
    const rankBadgeImage = getRankBadgeImage(user.rank);
    const position = user.position || 0;
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}${user.id}`;
    
    return (
      <div className={`relative flex flex-col items-center bg-gradient-to-b ${rankColors} rounded-xl p-6 border-2 ${borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-${podiumPosition === "first" ? "yellow" : podiumPosition === "second" ? "gray" : "amber"}-500/20`}>
        <div className="absolute top-3 right-3 text-xl">
          {user.badge || ''}
        </div>
        
        <div className="absolute top-3 left-3 bg-black/50 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white">
          {position}
        </div>
        
        <div className="relative mb-4">
          <div className={`${podiumPosition === "first" ? "w-24 h-24" : "w-20 h-20"} rounded-full bg-gray-800 overflow-hidden border-2 ${borderColor} shadow-lg`}>
            <img 
              src={randomAvatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`;
              }}
            />
          </div>
          
          {podiumPosition === "first" && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl drop-shadow-lg">
              👑
            </div>
          )}
          
          {rankBadgeImage && (
            <img 
              src={rankBadgeImage} 
              alt={user.rank} 
              className="absolute -bottom-2 -right-2 w-10 h-10 object-contain drop-shadow-md"
            />
          )}
        </div>
        
        <h3 className={`${podiumPosition === "first" ? "text-xl" : "text-lg"} font-bold text-white mb-2 text-center`}>
          {user.name || 'User'}
        </h3>
        
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-black/20 ${rankColors}`}>
          {user.rank || 'Unranked'}
        </div>
        
        <div className="text-xl font-bold text-white mb-1">
          {user.points ? user.points.toLocaleString() : '0'} 
          <span className="text-xs text-gray-300 ml-1">pts</span>
        </div>
        
        <div className="text-sm text-gray-300 flex items-center">
          <span className="mr-1">🏆</span>
          {user.challenges || 0} challenges
        </div>
      </div>
    );
  }