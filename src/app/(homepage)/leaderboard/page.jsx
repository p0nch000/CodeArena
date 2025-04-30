"use client";

import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import TopUserCard from "./components/TopUserCard";
import Leaderboard from "@/components/Leaderboard";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [challengesOrder, setChallengesOrder] = useState("desc");
  const [pointsOrder, setPointsOrder] = useState("desc");
  const [rankFilter, setRankFilter] = useState("all");
  const [topUsers, setTopUsers] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
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
  
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch(`/api/leaderboard/top?rank=${rankFilter}`);
        const data = await response.json();
        
        if (data.success) {
          setTopUsers(data.topUsers);
        }
      } catch (error) {
        console.error("Error fetching top users:", error);
      }
    };
    
    fetchTopUsers();
  }, [rankFilter]);
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          pointsOrder,
          challengesOrder,
          rankFilter,
          searchQuery,
          page: currentPage
        });
        
        const response = await fetch(`/api/leaderboard/filtered?${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
          setLeaderboardData(data.leaderboardData);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [challengesOrder, pointsOrder, rankFilter, searchQuery, currentPage]);
  
  const getPodiumUser = (position) => {
    return topUsers.find(user => user.position === position);
  };

  return (

    <div className="flex flex-col w-full px-6 py-4 pb-0 max-w-screen-2xl mx-auto font-mono">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
      </div>

      {topUsers.length > 0 && (
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="flex items-end justify-center order-2 md:order-1">
              <div className="w-full max-w-xs transform translate-y-4 md:translate-y-0">
                <TopUserCard 
                  user={getPodiumUser(2)} 
                  podiumPosition="second"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center order-1 md:order-2">
              <div className="w-full max-w-xs transform scale-110 z-10">
                <TopUserCard 
                  user={getPodiumUser(1)} 
                  podiumPosition="first"
                  featured={true} 
                />
              </div>
            </div>
            
            <div className="flex items-end justify-center order-3">
              <div className="w-full max-w-xs transform translate-y-8 md:translate-y-0">
                <TopUserCard 
                  user={getPodiumUser(3)} 
                  podiumPosition="third"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8 bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="search-players"
              type="search"
              placeholder="Search players by username..."
              className="block w-full pl-12 pr-4 py-3 text-base bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search players"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-400 mb-2">Points</div>
            <Dropdown
              options={pointsOptions.map(opt => opt.label)}
              value={pointsOptions.find(opt => opt.value === pointsOrder)?.label}
              onChange={(value) => {
                const option = pointsOptions.find(opt => opt.label === value);
                setPointsOrder(option?.value || "desc");
              }}
              label=""
              className="w-full"
              aria-label="Sort by points"
            />
          </div>
          
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-400 mb-2">Challenges</div>
            <Dropdown
              options={challengesOptions.map(opt => opt.label)}
              value={challengesOptions.find(opt => opt.value === challengesOrder)?.label}
              onChange={(value) => {
                const option = challengesOptions.find(opt => opt.label === value);
                setChallengesOrder(option?.value || "desc");
              }}
              label=""
              className="w-full"
              aria-label="Sort by challenges"
            />
          </div>
          
          <div className="w-full">
            <div className="block text-sm font-medium text-gray-400 mb-2">Rank</div>
            <Dropdown
              options={rankOptions.map(opt => opt.label)}
              value={rankOptions.find(opt => opt.value === rankFilter)?.label}
              onChange={(value) => {
                const option = rankOptions.find(opt => opt.label === value);
                setRankFilter(option?.value || "all");
              }}
              label=""
              className="w-full"
              aria-label="Filter by rank"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-0 pb-0">
        <Leaderboard 
          users={leaderboardData}
          isLoading={isLoading}
          showPagination={true}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}