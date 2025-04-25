"use client";

import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import TopUserCard from "./components/TopUserCard";
import Leaderboard from "@/components/Leaderboard";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados para los nuevos filtros
  const [challengesOrder, setChallengesOrder] = useState("desc");
  const [pointsOrder, setPointsOrder] = useState("desc");
  const [rankFilter, setRankFilter] = useState("all");
  
  // Opciones para los dropdowns actualizados
  const challengesOptions = [
    { value: "desc", label: "Challenges: High to Low" },
    { value: "asc", label: "Challenges: Low to High" },
  ];
  
  const pointsOptions = [
    { value: "desc", label: "Points: High to Low" },
    { value: "asc", label: "Points: Low to High" },
  ];
  
  const rankOptions = [
    { value: "all", label: "All Ranks" },
    { value: "bronze_coder", label: "Bronze Coder" },
    { value: "silver_developer", label: "Silver Developer" },
    { value: "gold_engineer", label: "Gold Engineer" },
    { value: "platinum_architect", label: "Platinum Architect" },
    { value: "diamond_debugger", label: "Diamond Debugger" },
    { value: "elite_codebreaker", label: "Elite Codebreaker" },
  ];
  
  // Mapeo de rangos para mostrar íconos adecuados (opcional)
  const rankIcons = {
    bronze_coder: "/AssetBronzeBadge.png",
    silver_developer: "/AssetSilverBadge.png",
    gold_engineer: "/AssetGoldBadge.png",
    platinum_architect: "/AssetPlatinumBadge.png",
    diamond_debugger: "/AssetEliteBadge.png",
    elite_codebreaker: "/AssetEliteBadge.png"
  };
  
  // Top 3 usuarios destacados
  const topUsers = [
    {
      id: 2,
      name: "CodeMaster",
      rank: "Elite Codebreaker",
      points: 12450,
      avatarUrl: "/avatars/codemaster.jpg",
      position: 1,
      badge: "🏆",
      challenges: 45
    },
    {
      id: 1,
      name: "DevNinja",
      rank: "Diamond Debugger",
      points: 9850,
      avatarUrl: "/avatars/devninja.jpg",
      position: 2,
      badge: "🥈",
      challenges: 38
    },
    {
      id: 3,
      name: "ByteWizard",
      rank: "Platinum Architect",
      points: 8720,
      avatarUrl: "/avatars/bytewizard.jpg",
      position: 3,
      badge: "🥉",
      challenges: 32
    }
  ];
  
  // Reorganizar usuarios para el podio: segundo, primero, tercero
  const podiumOrder = [
    topUsers.find(user => user.position === 2), // Segundo lugar (izquierda)
    topUsers.find(user => user.position === 1), // Primer lugar (centro)
    topUsers.find(user => user.position === 3)  // Tercer lugar (derecha)
  ];
  
  // Filtrar y ordenar usuarios según los criterios seleccionados
  useEffect(() => {
    // Aquí iría la lógica para filtrar y ordenar los usuarios
    // basada en challengesOrder, pointsOrder y rankFilter
    
    // Ejemplo básico:
    // const filtered = allUsers.filter(user => {
    //   // Filtrar por rango si no es "all"
    //   if (rankFilter !== "all") {
    //     const rankValue = rankFilter.replace('_', ' ');
    //     if (!user.rank.toLowerCase().includes(rankValue.toLowerCase())) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
    
    // // Ordenar por desafíos o puntos
    // const sorted = filtered.sort((a, b) => {
    //   if (challengesOrder !== "default") {
    //     return challengesOrder === "desc" 
    //       ? b.challenges - a.challenges 
    //       : a.challenges - b.challenges;
    //   }
    //   if (pointsOrder !== "default") {
    //     return pointsOrder === "desc" 
    //       ? b.points - a.points 
    //       : a.points - b.points;
    //   }
    //   return 0;
    // });
    
    // setFilteredUsers(sorted);
    
  }, [challengesOrder, pointsOrder, rankFilter, searchQuery]);
  
  return (
    <div className="flex flex-col w-full px-8 py-4 max-w-screen-2xl mx-auto font-mono">
      {/* Título y controles */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search players..."
            className="block w-full pl-10 pr-4 py-2.5 text-sm bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Dropdown para ordenar por desafíos */}
        <div className="w-48">
          <Dropdown
            options={challengesOptions.map(opt => opt.label)}
            value={challengesOptions.find(opt => opt.value === challengesOrder)?.label}
            onChange={(value) => {
              const option = challengesOptions.find(opt => opt.label === value);
              setChallengesOrder(option?.value || "desc");
            }}
            label=""
            className="w-full"
          />
        </div>
        
        {/* Dropdown para ordenar por puntos */}
        <div className="w-48">
          <Dropdown
            options={pointsOptions.map(opt => opt.label)}
            value={pointsOptions.find(opt => opt.value === pointsOrder)?.label}
            onChange={(value) => {
              const option = pointsOptions.find(opt => opt.label === value);
              setPointsOrder(option?.value || "desc");
            }}
            label=""
            className="w-full"
          />
        </div>
        
        {/* Dropdown para filtrar por rango */}
        <div className="w-48">
          <Dropdown
            options={rankOptions.map(opt => opt.label)}
            value={rankOptions.find(opt => opt.value === rankFilter)?.label}
            onChange={(value) => {
              const option = rankOptions.find(opt => opt.label === value);
              setRankFilter(option?.value || "all");
            }}
            label=""
            className="w-full"
          />
        </div>
      </div>
      
      {/* Podio para los top 3 */}
      <div className="grid grid-cols-3 gap-4 mb-12 px-4">
        {/* Segundo lugar (izquierda) */}
        <div className="flex items-center justify-center">
          <div className="w-full md:w-11/12">
            <TopUserCard 
              user={podiumOrder[0]} 
              podiumPosition="second"
            />
          </div>
        </div>
        
        {/* Primer lugar (centro - ligeramente más grande) */}
        <div className="flex items-center justify-center">
          <div className="w-full md:w-full transform md:scale-105">
            <TopUserCard 
              user={podiumOrder[1]} 
              podiumPosition="first"
              featured={true} 
            />
          </div>
        </div>
        
        {/* Tercer lugar (derecha) */}
        <div className="flex items-center justify-center">
          <div className="w-full md:w-11/12">
            <TopUserCard 
              user={podiumOrder[2]} 
              podiumPosition="third"
            />
          </div>
        </div>
      </div>
      
      {/* Tabla principal de leaderboard */}
      <div className="flex-1">
        <Leaderboard 
          challengesOrder={challengesOrder}
          pointsOrder={pointsOrder}
          rankFilter={rankFilter}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}