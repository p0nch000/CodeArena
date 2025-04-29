"use client";

import { useState } from "react";
import Dropdown from "@/components/Dropdown";
import MetricCard from "./components/MetricCard";
import LanguageDistributionChart from "./components/LanguageDistributionChart";
import SubmissionsAreaChart from './components/SubmissionsAreaChart';
import { CodeBracketIcon, UsersIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Función formateadora para los valores del gráfico
const valueFormatter = (item) => `${item.value}%`;

export default function AdminDashboard() {
  // Filter states
  const [timeFilter, setTimeFilter] = useState("Last week");
  const [difficultyFilter, setDifficultyFilter] = useState("All difficulties");
  const [languageFilter, setLanguageFilter] = useState("All languages");
  
  // Dropdown options
  const timeOptions = ["Last week", "Last month", "Last quarter", "Last year"];
  const difficultyOptions = ["All difficulties", "Easy", "Medium", "Hard"];
  const languageOptions = ["All languages", "JavaScript", "Python", "Java", "C++", "Go"];
  
  // Sample data for metrics
  const metricsData = [
    {
      title: "Total Challenges",
      value: "248",
      icon: <CodeBracketIcon className="h-6 w-6" />,
      change: "+12% more than last month",
      trend: "up",
      color: "red"
    },
    {
      title: "Registered Users",
      value: "1,547",
      icon: <UsersIcon className="h-6 w-6" />,
      change: "+8% more than last month",
      trend: "up",
      color: "blue"
    },
    {
      title: "Total Submissions",
      value: "15,832",
      icon: <DocumentTextIcon className="h-6 w-6" />,
      change: "+10% more than last month",
      trend: "up",
      color: "purple"
    },
    {
      title: "Success Rate",
      value: "76.4%",
      icon: <ChartBarIcon className="h-6 w-6" />,
      change: "-3% less than last month",
      trend: "down",
      color: "green"
    }
  ];

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
  const languageDistribution = [
    { label: 'JavaScript', value: 35 },
    { label: 'Python', value: 25 },
    { label: 'Java', value: 15 },
    { label: 'C++', value: 12 },
    { label: 'Go', value: 8 },
    { label: 'Others', value: 5 }
  ];

  const submissionsData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    series: [
      {
        data: [1400, 1850, 1650, 2250, 2800, 2350, 3100, 3500, 3200],
        label: 'Submissions',
        color: '#b8383a',
      }
    ]
  };

  const formattedData = submissionsData.months.map((month, index) => ({
    month,
    submissions: submissionsData.series[0].data[index],
  }));

  return (
    // Outer container with full background
    <div className="flex justify-center bg-mahindra-navy-blue min-h-screen w-full py-6 font-mono">
      {/* Central container with limited width */}
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header with title and filters */}
        <div className="border-l-4 border-red-500 pl-4 mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">Administrative Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Real-time monitoring of key platform metrics
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* <div className="w-44">
            <Dropdown
              options={timeOptions}
              value={timeFilter}
              onChange={setTimeFilter}
              label=""
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          
          <div className="w-48">
            <Dropdown
              options={difficultyOptions}
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              label=""
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          
          <div className="w-48">
            <Dropdown
              options={languageOptions}
              value={languageFilter}
              onChange={setLanguageFilter}
              label=""
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div> */}

          <div className="ml-auto text-sm text-gray-400 flex items-center">
            <span>Updated 5 minutes ago</span>
            <button className="ml-2 text-red-500 hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricsData.map((metric, index) => (
            <MetricCard 
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              change={metric.change}
              trend={metric.trend}
              color={metric.color}
            />
          ))}
        </div>

        {/* Containers for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Language distribution chart - now as a separate component */}
          <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Language Distribution</h2>
            <div className="h-80 bg-gray-800/50 rounded-lg p-3">
              <LanguageDistributionChart data={languageDistribution} />
            </div>
          </div>

          {/* Submissions evolution chart */}
          <div className="bg-gray-900/70 rounded-xl p-5 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Submissions Evolution</h2>
            <div className="h-80 bg-gray-800/50 rounded-lg">
              <SubmissionsAreaChart data={submissionsData} />
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