"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Avatar
} from "@nextui-org/react";

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

export default function Leaderboard({ users = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }
  
  if (!users || users.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-400">
        No users found matching your criteria
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full rounded-xl overflow-hidden shadow-md border border-zinc-800 bg-mahindra-dark-blue">
        <Table
          isStriped
          removeWrapper
          aria-label="Leaderboard table"
          classNames={{
            table: "bg-mahindra-dark-blue text-white",
            th: "text-xs font-bold text-zinc-300 bg-zinc-800/50 py-5 text-center uppercase tracking-wider",
            td: "text-sm text-mahindra-light-gray py-4 text-center",
            tr: "border-b border-zinc-800/30 transition-colors",
          }}
        >
          <TableHeader>
            <TableColumn>Rank</TableColumn>
            <TableColumn>User</TableColumn>
            <TableColumn>Challenges</TableColumn>
            <TableColumn>Points</TableColumn>
            <TableColumn>Badge</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user, idx) => {
              const { backgroundColor, textColor } = getBadgeStyles(user.rank);
              const rankBadgeImage = getRankBadgeImage(user.rank);
              const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'user'}${user.id}`;

              return (
                <TableRow 
                  key={user.id} 
                  className="group cursor-pointer"
                >
                  <TableCell className="text-red-400 font-semibold group-hover:bg-red-500/10">#{idx + 1}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">
                    <div className="flex items-center justify-center space-x-2">
                      <Avatar
                        src={user.avatarUrl || randomAvatar}
                        size="sm"
                        className="mr-2"
                      />
                      <span className="text-mahindra-white font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="group-hover:bg-red-500/10">{user.challenges}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">{user.points.toLocaleString()}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">
                    <div className="flex justify-center items-center space-x-2">
                      {rankBadgeImage && (
                        <img 
                          src={rankBadgeImage} 
                          alt={user.rank} 
                          className="w-8 h-8 object-contain" 
                        />
                      )}
                      <Chip
                        variant="shadow"
                        size="sm"
                        classNames={{
                          base: "px-3 py-1.5",
                          content: "font-semibold tracking-wide",
                        }}
                        style={{
                          backgroundColor,
                          color: textColor,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                        }}
                      >
                        {user.rank}
                      </Chip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
