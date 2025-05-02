"use client";

import { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import MetricCard from "./components/MetricCard";
import LanguageDistributionChart from "./components/LanguageDistributionChart";
import SubmissionsAreaChart from './components/SubmissionsAreaChart';
import { CodeBracketIcon, UsersIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Link from "next/link";

// Función formateadora para los valores del gráfico
const valueFormatter = (item) => `${item.value}%`;

export default function AdminDashboard() {
  // Filter states
  const [timeFilter, setTimeFilter] = useState("Last week");
  const [difficultyFilter, setDifficultyFilter] = useState("All difficulties");
  const [languageFilter, setLanguageFilter] = useState("All languages");
  
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
  
  // Last updated timestamps
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Dropdown options
  const timeOptions = ["Last week", "Last month", "Last quarter", "Last year"];
  const difficultyOptions = ["All difficulties", "Easy", "Medium", "Hard"];
  const languageOptions = ["All languages", "JavaScript", "Python", "Java", "C++", "Go"];
  
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
  
  // Refresh all dashboard data
  const refreshData = () => {
    fetchChallengesData();
    fetchUsersData();
    fetchSubmissionsData();
    fetchLanguageDistribution();
    fetchSubmissionsChartData();
    fetchSuccessRateData();
  };
  
  // Load all data on component mount
  useEffect(() => {
    fetchChallengesData();
    fetchUsersData();
    fetchSubmissionsData();
    fetchLanguageDistribution();
    fetchSubmissionsChartData();
    fetchSuccessRateData();
  }, []);
  
  // Check if any metric is still loading
  const isAnyLoading = loadingChallenges || loadingUsers || loadingSubmissions || loadingLanguageDist || loadingSubmissionsChart || loadingSuccessRate;
  
  // Sample data for the challenges table
  const challengesTableData = [
    {
      id: 1,
      name: "Binary Search Tree",
      difficulty: "Medium",
      submissions: 1234,
      successRate: 68,
      points: 85
    },
    {
      id: 2,
      name: "Array Rotation",
      difficulty: "Easy",
      submissions: 2567,
      successRate: 89,
      points: 45
    },
    {
      id: 3,
      name: "Dynamic Programming",
      difficulty: "Hard",
      submissions: 987,
      successRate: 42,
      points: 150
    },
  ];

  // Datos para la distribución de lenguajes
  const languageDistributionData = [
    { label: 'JavaScript', value: 35 },
    { label: 'Python', value: 25 },
    { label: 'Java', value: 15 },
    { label: 'C++', value: 12 },
    { label: 'Go', value: 8 },
    { label: 'Others', value: 5 }
  ];

  const submissionsChartDataMock = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    series: [
      {
        data: [1400, 1850, 1650, 2250, 2800, 2350, 3100, 3500, 3200],
        label: 'Submissions',
        color: '#b8383a',
      }
    ]
  };

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
          <h2 className="text-xl font-bold text-white mb-4">Challenge Metrics</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800/50 rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-gray-700">
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
                {challengesTableData.map((challenge) => {
                  // Determine color based on difficulty
                  const difficultyColor = 
                    challenge.difficulty === "Easy" ? "text-green-400 bg-green-900/30" :
                    challenge.difficulty === "Medium" ? "text-yellow-400 bg-yellow-900/30" :
                    "text-red-400 bg-red-900/30";
                  
                  return (
                    <tr key={challenge.id} className="border-b border-gray-700 hover:bg-gray-700/30">
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
        </div>
      </div>
    </div>
  );
}