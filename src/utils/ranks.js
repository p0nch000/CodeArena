export function getBadgeStyles(rank) {
  if (!rank) return {
    backgroundColor: "#6B728033", 
    textColor: "#6B7280"
  };

  const rankLower = rank.toLowerCase();
  
  if (rankLower.includes('elite') || rankLower.includes('codebreaker'))
    return { backgroundColor: "#DC262633", textColor: "#FFB627" };
  if (rankLower.includes('diamond') || rankLower.includes('debugger'))
    return { backgroundColor: "#A78BFA33", textColor: "#E83D84" };
  if (rankLower.includes('platinum') || rankLower.includes('architect'))
    return { backgroundColor: "#60A5FA33", textColor: "#61A1DD" };
  if (rankLower.includes('gold') || rankLower.includes('engineer'))
    return { backgroundColor: "#EAB30833", textColor: "#FFC700" };
  if (rankLower.includes('silver') || rankLower.includes('developer'))
    return { backgroundColor: "#9CA3AF33", textColor: "#9CA3AF" };
  if (rankLower.includes('bronze') || rankLower.includes('coder'))
    return { backgroundColor: "#B4590033", textColor: "#CD7F32" };
    
  return { backgroundColor: "#6B728033", textColor: "#6B7280" };
}

export function getRankBadgeImage(rank) {
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
} 