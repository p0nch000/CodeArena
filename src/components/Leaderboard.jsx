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
  Avatar,
  Pagination
} from "@nextui-org/react";
import { useState, useEffect } from "react";
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

export default function Leaderboard({ 
  users = [], 
  isLoading = false,
  showPagination = false,
  onPageChange,
  totalPages = 1,
  currentPage = 1

}) {
  const [internalPage, setInternalPage] = useState(currentPage);

    // Actualizar el estado interno cuando cambia el prop
    useEffect(() => {
      setInternalPage(currentPage);
    }, [currentPage]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12" role = "progressbar">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }
  
  if (!users || users.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-400">
        No users found matching your criteria
      </div>
    );
  }

  const handlePageChange = (page) => {
    setInternalPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Función para calcular el ranking global correcto
  const calculateGlobalRank = (idx) => {
    return ((currentPage - 1) * 10) + idx + 1;
  };

  return (
    <div className="w-full mb-0 pb-0">
      <div className="w-full rounded-xl overflow-hidden shadow-md border border-zinc-800 bg-mahindra-dark-blue">
        <Table
          isStriped
          removeWrapper
          aria-label="Leaderboard table"
          classNames={{
            table: "bg-mahindra-dark-blue text-white",
            th: "text-xs font-bold text-zinc-300 bg-zinc-800/50 py-5 text-center uppercase tracking-wider",
            td: "text-sm text-mahindra-light-gray py-5 text-center",
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

              // Calculate the global rank based on the current page and index
              const globalRank = calculateGlobalRank(idx);

              return (
                <TableRow 
                  key={user.id} 
                  className="group cursor-pointer hover:bg-red-500/10"
                >
                  <TableCell className="text-red-400 font-semibold group-hover:text-red-300">#{globalRank}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Avatar
                        src={user.avatarUrl || generateAvatar(user)}
                        size="sm"
                        isBordered
                        color="danger"
                        className="mr-2"
                      />
                      <span className="text-mahindra-white font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.challenges}</TableCell>
                  <TableCell>{user.points.toLocaleString()}</TableCell>
                  <TableCell>
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

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-8 mb-10">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={internalPage}
            onChange={handlePageChange}
            size="lg"
            classNames={{
              wrapper: "gap-2 overflow-visible rounded",
              item: "w-10 h-10 text-md rounded-md bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
              cursor: "bg-mahindra-red text-white font-bold shadow-md",
              next: "bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
              prev: "bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
            }}
          />
        </div>
      )}
    </div>
  );
}
