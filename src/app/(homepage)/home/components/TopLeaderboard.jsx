"use client";

import { Chip } from "@nextui-org/react";
import { generateAvatar } from "@/utils/avatar";

function getBadgeStyles(rank) {
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

function getRankBadgeImage(rank) {
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

export function TopLeaderboard({ topUsers = [] }) {
  if (!topUsers || topUsers.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No data available yet. Be the first on the leaderboard!
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="text-xs font-bold text-zinc-300 bg-zinc-800/50">
            <th className="py-4 px-4 text-center">Rank</th>
            <th className="py-4 px-4 text-left">User</th>
            <th className="py-4 px-4 text-center">Challenges</th>
            <th className="py-4 px-4 text-center">Points</th>
            <th className="py-4 px-4 text-center">Badge</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((user, idx) => {
            const { backgroundColor, textColor } = getBadgeStyles(user.rank);
            const rankBadgeImage = getRankBadgeImage(user.rank);
            
            // Determine the medal for top positions
            let medal = null;
            if (idx === 0) medal = "🥇";
            else if (idx === 1) medal = "🥈";
            else if (idx === 2) medal = "🥉";

            return (
              <tr 
                key={user.id} 
                className="border-b border-zinc-800/30 hover:bg-red-500/10 transition-colors"
              >
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-red-400 font-semibold">{idx + 1}</span>
                    {medal && <span className="ml-1">{medal}</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-800 flex-shrink-0 border border-red-500/50">
                      <img 
                        src={user.avatarUrl || generateAvatar(user)} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        loading="eager"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                        }}
                      />
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-300">{user.challenges}</td>
                <td className="py-3 px-4 text-center font-semibold text-white">{user.points.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {rankBadgeImage && (
                      <img 
                        src={rankBadgeImage} 
                        alt={user.rank} 
                        className="w-6 h-6 object-contain" 
                      />
                    )}
                    <Chip
                      variant="shadow"
                      size="sm"
                      classNames={{
                        base: "px-2 py-1",
                        content: "font-semibold tracking-wide text-xs",
                      }}
                      style={{
                        backgroundColor,
                        color: textColor,
                        fontWeight: 600,
                        borderRadius: "9999px",
                      }}
                    >
                      {user.rank}
                    </Chip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 