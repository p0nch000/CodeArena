"use client";

import { useState, useEffect, useMemo } from "react";
import Dropdown from "@/components/Dropdown";
import MetricCard from "./components/MetricCard";
import LanguageDistributionChart from "./components/LanguageDistributionChart";
import SubmissionsAreaChart from './components/SubmissionsAreaChart';
import { CodeBracketIcon, UsersIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import ChallengeMetricsTable from "./components/ChallengeMetricsTable";
import { Pagination } from "@nextui-org/react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; 


export default function AdminDashboard() {
  
  // Data states - individual state for each metric
  const [challengesData, setChallengesData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [submissionsData, setSubmissionsData] = useState(null);
  
  // Loading states - individual loading state for each metric
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  
  // Error states - individual error state for each metric
  const [challengesError, setChallengesError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [submissionsError, setSubmissionsError] = useState(null);

  // Language distribution data
  const [languageDistData, setLanguageDistData] = useState([]);
  const [loadingLanguageDist, setLoadingLanguageDist] = useState(true);
  const [languageDistError, setLanguageDistError] = useState(null);

  // Submissions chart data
  const [submissionsChartData, setSubmissionsChartData] = useState(null);
  const [loadingSubmissionsChart, setLoadingSubmissionsChart] = useState(true);
  const [submissionsChartError, setSubmissionsChartError] = useState(null);

  // Success rate data
  const [successRateData, setSuccessRateData] = useState(null);
  const [loadingSuccessRate, setLoadingSuccessRate] = useState(true);
  const [successRateError, setSuccessRateError] = useState(null);

  const [challengesTableData, setChallengesTableData] = useState([]);
  const [loadingChallengesTable, setLoadingChallengesTable] = useState(true);
  const [challengesTableError, setChallengesTableError] = useState(null);

  const [challengeSearchQuery, setChallengeSearchQuery] = useState("");
  const [challengeCurrentPage, setChallengeCurrentPage] = useState(1);
  const CHALLENGE_PAGE_SIZE = 5;

  // Añade estos estados para los filtros
const [difficultyFilter, setDifficultyFilter] = useState("All difficulties");
const [sortCriteria, setSortCriteria] = useState("submissions");
  
  // Last updated timestamps
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Dropdown options
  const difficultyOptions = ["All difficulties", "Easy", "Medium", "Hard"];
  const sortOptions = [
    { value: 'submissions', label: 'Sort by Submissions' },
    { value: 'successRate', label: 'Sort by Success Rate' },
    { value: 'points', label: 'Sort by Average Points' }
  ];
  
  // Individual fetch functions for each metric
  async function fetchChallengesData() {
    setLoadingChallenges(true);
    try {
      const response = await fetch('/api/dashboard/challenges');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch challenges data');
      }
      
      setChallengesData(data.data);
      setChallengesError(null);
    } catch (err) {
      console.error('Error fetching challenges data:', err);
      setChallengesError(err.message);
    } finally {
      setLoadingChallenges(false);
      setLastUpdated(new Date());
    }
  }
  
  async function fetchUsersData() {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/dashboard/users');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users data');
      }
      
      setUsersData(data.data);
      setUsersError(null);
    } catch (err) {
      console.error('Error fetching users data:', err);
      setUsersError(err.message);
    } finally {
      setLoadingUsers(false);
      setLastUpdated(new Date());
    }
  }

  async function fetchLanguageDistribution() {
    setLoadingLanguageDist(true);
    try {
      const response = await fetch('/api/dashboard/planguages');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch language distribution data');
      }
      
      setLanguageDistData(data.data);
      setLanguageDistError(null);
    } catch (err) {
      console.error('Error fetching language distribution:', err);
      setLanguageDistError(err.message);
    } finally {
      setLoadingLanguageDist(false);
      setLastUpdated(new Date());
    }
  }
  
  async function fetchSubmissionsData() {
    setLoadingSubmissions(true);
    try {
      const response = await fetch('/api/dashboard/submissions');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch submissions data');
      }
      
      setSubmissionsData(data.data);
      setSubmissionsError(null);
    } catch (err) {
      console.error('Error fetching submissions data:', err);
      setSubmissionsError(err.message);
    } finally {
      setLoadingSubmissions(false);
      setLastUpdated(new Date());
    }
  }

  async function fetchSubmissionsChartData() {
    setLoadingSubmissionsChart(true);
    try {
      const response = await fetch('/api/dashboard/submissions-chart');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch submissions chart data');
      }
      
      setSubmissionsChartData(data.data);
      setSubmissionsChartError(null);
    } catch (err) {
      console.error('Error fetching submissions chart data:', err);
      setSubmissionsChartError(err.message);
    } finally {
      setLoadingSubmissionsChart(false);
      setLastUpdated(new Date());
    }
  }

  async function fetchSuccessRateData() {
    setLoadingSuccessRate(true);
    try {
      const response = await fetch('/api/dashboard/success-rate');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch success rate data');
      }
      
      setSuccessRateData(data.data);
      setSuccessRateError(null);
    } catch (err) {
      console.error('Error fetching success rate data:', err);
      setSuccessRateError(err.message);
    } finally {
      setLoadingSuccessRate(false);
      setLastUpdated(new Date());
    }
  }

  async function fetchChallengeMetricsData() {
    setLoadingChallengesTable(true);
    try {
      const response = await fetch('/api/dashboard/challenge-metrics');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch challenge metrics data');
      }
      
      setChallengesTableData(data.data);
      setChallengesTableError(null);
    } catch (err) {
      console.error('Error fetching challenge metrics data:', err);
      setChallengesTableError(err.message);
    } finally {
      setLoadingChallengesTable(false);
      setLastUpdated(new Date());
    }
  }
  
  // Refresh all dashboard data
  const refreshData = () => {
    fetchChallengesData();
    fetchUsersData();
    fetchSubmissionsData();
    fetchLanguageDistribution();
    fetchSubmissionsChartData();
    fetchSuccessRateData();
    fetchChallengeMetricsData(); 
  };
  
  // Load all data on component mount
  useEffect(() => {
    fetchChallengesData();
    fetchUsersData();
    fetchSubmissionsData();
    fetchLanguageDistribution();
    fetchSubmissionsChartData();
    fetchSuccessRateData();
    fetchChallengeMetricsData(); 
  }, []);
  
  // Check if any metric is still loading
  const isAnyLoading = loadingChallenges || loadingUsers || loadingSubmissions || loadingLanguageDist || loadingSubmissionsChart || loadingSuccessRate || loadingChallengesTable;
  
  // Get formatted timestamp for last updated
  const getLastUpdatedText = () => {
    if (!lastUpdated) return "Never updated";
    
    const now = new Date();
    const diffMs = now - lastUpdated;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Updated just now";
    if (diffMins === 1) return "Updated 1 minute ago";
    return `Updated ${diffMins} minutes ago`;
  };

  // Filtra y pagina los datos de la tabla de desafíos
  const filteredAndPaginatedChallengeData = useMemo(() => {
    if (!challengesTableData || !Array.isArray(challengesTableData)) {
      return { challenges: [], totalPages: 0, totalItems: 0 };
    }
    
    // Primero aplicar filtro de texto de búsqueda
    let filtered = challengeSearchQuery
      ? challengesTableData.filter(challenge => 
          challenge.name.toLowerCase().includes(challengeSearchQuery.toLowerCase())
        )
      : [...challengesTableData];
    
    // Filtro por dificultad
    if (difficultyFilter !== "All difficulties") {
      filtered = filtered.filter(challenge => challenge.difficulty === difficultyFilter);
    }
    
    // Aplicar ordenamiento según el criterio seleccionado (siempre de mayor a menor)
    if (sortCriteria === 'submissions') {
      filtered.sort((a, b) => b.submissions - a.submissions);
    } else if (sortCriteria === 'successRate') {
      filtered.sort((a, b) => b.successRate - a.successRate);
    } else if (sortCriteria === 'points') {
      filtered.sort((a, b) => b.points - a.points);
    }
    
    // Calcular número total de páginas
    const totalPages = Math.ceil(filtered.length / CHALLENGE_PAGE_SIZE);
    
    // Paginar los resultados
    const startIndex = (challengeCurrentPage - 1) * CHALLENGE_PAGE_SIZE;
    const endIndex = startIndex + CHALLENGE_PAGE_SIZE;
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    return {
      challenges: paginatedData,
      totalPages: totalPages,
      totalItems: filtered.length
    };
  }, [challengesTableData, challengeSearchQuery, challengeCurrentPage, CHALLENGE_PAGE_SIZE, difficultyFilter, sortCriteria]);

// Añade esta función para manejar el cambio de página
const handleChallengePageChange = (page) => {
    setChallengeCurrentPage(page);
  };

  // Añade esta función para manejar la búsqueda
  const handleChallengeSearch = (e) => {
    setChallengeSearchQuery(e.target.value);
    setChallengeCurrentPage(1); // Resetear a la primera página al buscar
  };

  return (
    // Outer container with full background
    <div className="flex justify-center bg-mahindra-navy-blue min-h-screen w-full py-6 font-mono">
      {/* Central container with limited width */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header with title and filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h1 className="text-3xl font-bold text-white mb-1">Administrative Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Real-time monitoring of key platform metrics
            </p>
          </div>
          <Link 
            href="/admin/create"
            className="bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105"
          >
            Create Challenge
          </Link>
        </div>

        {/* Filters and refresh button */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Filters commented out for now */}
          <div className="ml-auto text-sm text-gray-400 flex items-center">
            <span>{isAnyLoading ? "Updating..." : getLastUpdatedText()}</span>
            <button 
              className="ml-2 text-red-500 hover:text-red-400"
              onClick={refreshData}
              disabled={isAnyLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isAnyLoading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error messages - show combined errors if any */}
        {(challengesError || usersError || submissionsError || languageDistError) && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading dashboard data</p>
            {challengesError && <p className="text-sm">Challenges: {challengesError}</p>}
            {usersError && <p className="text-sm">Users: {usersError}</p>}
            {submissionsError && <p className="text-sm">Submissions: {submissionsError}</p>}
            {languageDistError && <p className="text-sm">Language Distribution: {languageDistError}</p>}
            {submissionsChartError && <p className="text-sm">Submissions Chart: {submissionsChartError}</p>}
            {successRateError && <p className="text-sm">Success Rate: {successRateError}</p>}
            {challengesTableError && <p className="text-sm">Challenge Metrics: {challengesTableError}</p>}
          </div>
        )}

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Challenges metric */}
          <div>
            {loadingChallenges ? (
              <div className="bg-gray-800/50 animate-pulse rounded-xl p-5 h-32"></div>
            ) : (
              <MetricCard 
                title="Total Challenges"
                value={challengesData?.totalCount.toLocaleString() || "0"}
                icon={<CodeBracketIcon className="h-6 w-6" />}
                change={`${challengesData?.growth > 0 ? '+' : ''}${challengesData?.growth}% ${challengesData?.growth >= 0 ? 'more' : 'less'} than last month`}
                trend={challengesData?.growth >= 0 ? "up" : "down"}
                color="red"
              />
            )}
          </div>

          {/* Users metric */}
          <div>
            {loadingUsers ? (
              <div className="bg-gray-800/50 animate-pulse rounded-xl p-5 h-32"></div>
            ) : (
              <MetricCard 
                title="Registered Users"
                value={usersData?.totalCount.toLocaleString() || "0"}
                icon={<UsersIcon className="h-6 w-6" />}
                change={`${usersData?.growth > 0 ? '+' : ''}${usersData?.growth}% ${usersData?.growth >= 0 ? 'more' : 'less'} than last month`}
                trend={usersData?.growth >= 0 ? "up" : "down"}
                color="blue"
              />
            )}
          </div>

          {/* Submissions metric */}
          <div>
            {loadingSubmissions ? (
              <div className="bg-gray-800/50 animate-pulse rounded-xl p-5 h-32"></div>
            ) : (
              <MetricCard 
                title="Total Submissions"
                value={submissionsData?.totalCount.toLocaleString() || "0"}
                icon={<DocumentTextIcon className="h-6 w-6" />}
                change={`${submissionsData?.growth > 0 ? '+' : ''}${submissionsData?.growth}% ${submissionsData?.growth >= 0 ? 'more' : 'less'} than last month`}
                trend={submissionsData?.growth >= 0 ? "up" : "down"}
                color="purple"
              />
            )}
          </div>

          {/* Success Rate metric */}
          <div>
            {loadingSuccessRate ? (
              <div className="bg-gray-800/50 animate-pulse rounded-xl p-5 h-32"></div>
            ) : (
              <MetricCard 
                title="Success Rate"
                value={`${successRateData?.rate || 0}%`}
                icon={<ChartBarIcon className="h-6 w-6" />}
                change={successRateData?.growth !== 0 
                  ? `${successRateData?.growth > 0 ? '+' : ''}${successRateData?.growth}% ${successRateData?.growth >= 0 ? 'better' : 'worse'} than last month`
                  : "Based on correct submissions"}
                trend={successRateData?.growth > 0 ? "up" : successRateData?.growth < 0 ? "down" : "neutral"}
                color="green"
              />
            )}
          </div>
        </div> 

        {/* Rest of the dashboard remains unchanged */}
        {/* Containers for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Language distribution chart */}
          <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Language Distribution</h2>
            <div className="h-80 bg-gray-800/50 rounded-lg p-3">
              {loadingLanguageDist ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              ) : languageDistData.length > 0 ? (
                <LanguageDistributionChart data={languageDistData} />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No submission data available
                </div>
              )}
            </div>
          </div>

          {/* Submissions evolution chart */}
          <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Submissions Evolution</h2>
            <div className="h-80 bg-gray-800/50 rounded-lg">
              {loadingSubmissionsChart ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              ) : submissionsChartData && submissionsChartData.months.length > 0 ? (
                <SubmissionsAreaChart data={submissionsChartData} />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No submission data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenge metrics table */}
        <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800 overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold text-white">Challenge Metrics</h2>
          </div>
          
          {/* Filtros estilo leaderboard */}
          <div className="mb-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search challenges by name..."
                  className="block w-full pl-12 pr-4 py-3 text-base bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  value={challengeSearchQuery}
                  onChange={handleChallengeSearch}
                  aria-label="Search challenges"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <div className="block text-sm font-medium text-gray-400 mb-2">Difficulty</div>
                <Dropdown
                  options={difficultyOptions}
                  value={difficultyFilter}
                  onChange={(value) => {
                    setDifficultyFilter(value);
                    setChallengeCurrentPage(1); // Reset to first page
                  }}
                  label=""
                  className="w-full"
                  aria-label="Filter by difficulty"
                />
              </div>
              
              <div className="w-full">
                <div className="block text-sm font-medium text-gray-400 mb-2">Sort By</div>
                <Dropdown
                  options={sortOptions.map(opt => opt.label)}
                  value={sortOptions.find(opt => opt.value === sortCriteria)?.label}
                  onChange={(label) => {
                    const option = sortOptions.find(opt => opt.label === label);
                    setSortCriteria(option?.value || "submissions");
                    setChallengeCurrentPage(1); // Reset to first page
                  }}
                  label=""
                  className="w-full"
                  aria-label="Sort challenges by"
                />
              </div>
            </div>
          </div>
          
          {loadingChallengesTable ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : filteredAndPaginatedChallengeData.challenges && filteredAndPaginatedChallengeData.challenges.length > 0 ? (
            <>
              <ChallengeMetricsTable 
                metrics={filteredAndPaginatedChallengeData.challenges} 
                currentPage={challengeCurrentPage}
                pageSize={CHALLENGE_PAGE_SIZE}
              />
              
              {/* Paginación */}
              {filteredAndPaginatedChallengeData.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={filteredAndPaginatedChallengeData.totalPages}
                    initialPage={1}
                    page={challengeCurrentPage}
                    onChange={handleChallengePageChange}
                    size="sm"
                    classNames={{
                      wrapper: "gap-1 overflow-visible rounded",
                      item: "w-8 h-8 text-sm rounded-md bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
                      cursor: "bg-mahindra-red text-white font-bold shadow-md",
                      next: "bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
                      prev: "bg-gray-800/50 text-gray-300 hover:bg-red-500/20",
                    }}
                  />
                </div>
              )}
              
              {/* Resultados de búsqueda si hay búsqueda activa */}
              {(challengeSearchQuery || difficultyFilter !== "All difficulties") && (
                <div className="text-sm text-gray-400 mt-2">
                  Showing {filteredAndPaginatedChallengeData.challenges.length} of {filteredAndPaginatedChallengeData.totalItems} results
                </div>
              )}
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">
              {challengeSearchQuery || difficultyFilter !== "All difficulties" 
                ? "No challenges found matching your criteria" 
                : "No challenge metrics available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}