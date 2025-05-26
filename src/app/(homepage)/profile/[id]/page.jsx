"use client";
import { useAuth } from '@/core/context/AuthContext';
import { useEffect, useState, use } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { Progress, Divider, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Link } from '@nextui-org/react';
import { getBadgeStyles, getRankBadgeImage } from '@/utils/ranks';
import { FaTrophy, FaCode, FaHistory, FaCheck, FaTimes, FaCalendarAlt, FaMemory, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import { HiLightningBolt, HiChartBar, HiPuzzle } from 'react-icons/hi';
import NextLink from 'next/link';

export default function ProfilePage({ params }) {
    const { user } = useAuth();
    const unwrappedParams = use(params);
    const userId = unwrappedParams.id;
    
    const [profile, setProfile] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const difficultyTextColors = {
        easy: "text-emerald-400",
        medium: "text-amber-400",
        hard: "text-red-400"
    };

    const difficultyBgColors = {
        easy: "bg-emerald-700/30",
        medium: "bg-amber-700/30",
        hard: "bg-red-700/30" 
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const roundNumber = (num) => {
        if (num === null || num === undefined) return 'N/A';
        return Math.round(num * 100) / 100;
    };

    useEffect(() => {
        if (user) {
            setIsCurrentUser(userId === user.id);
            fetchProfileData(userId);
        }
    }, [user, userId]);

    const fetchProfileData = async (targetUserId) => {
        setLoading(true);
        try {
            const profileRes = await fetch(`/api/user/profile?userId=${targetUserId}`);
            const profileData = await profileRes.json();
            const challengesRes = await fetch(`/api/user/challenges?userId=${targetUserId}`);
            const challengesData = await challengesRes.json();
            const submissionsRes = await fetch(`/api/user/submissions?userId=${targetUserId}&limit=10`);
            const submissionsData = await submissionsRes.json();
            
            if (profileData.success) {
                setProfile(profileData.profile);
                setProfileUser(profileData.profile.user);
            }
            if (challengesData.success) setChallenges(challengesData.challenges);
            if (submissionsData.success) setSubmissions(submissionsData.submissions);
            
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] bg-mahindra-navy-blue">
                <Spinner size="lg" color="danger" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-white bg-mahindra-navy-blue">
                <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
                <p className="text-gray-400">We couldn't load the profile data. Please try again later.</p>
            </div>
        );
    }
    
    const rankStyle = profile.rank ? getBadgeStyles(profile.rank.name) : getBadgeStyles(null);
    const rankBadgeImage = profile.rank ? getRankBadgeImage(profile.rank.name) : null;

    const maxProblems = Math.max(50, profile.stats.totalSolved + 20); 
    const maxEasy = Math.max(20, profile.stats.byDifficulty.easy + 10);
    const maxMedium = Math.max(15, profile.stats.byDifficulty.medium + 8);
    const maxHard = Math.max(10, profile.stats.byDifficulty.hard + 5);

    return (
        <div className="flex justify-center bg-mahindra-navy-blue min-h-screen w-full py-6 font-mono">
            <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Profile Header - Modern Card with Background Gradient */}
                <div className="w-full bg-gray-900/70 border border-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900 overflow-hidden">
                            <UserAvatar user={profileUser} size="lg" className="w-full h-full" />
                        </div>
                        
                        {/* User Info */}
                        <div className="flex flex-col items-center md:items-start">
                            <h1 className="text-2xl font-bold text-white">{profileUser.username}</h1>
                            <p className="text-gray-400 mb-2">{profileUser.role}</p>
                            <div className="mt-2 flex items-center gap-3">
                                <Chip
                                    startContent={<FaTrophy className="text-xs" />}
                                    style={{
                                        backgroundColor: rankStyle.backgroundColor,
                                        color: rankStyle.textColor,
                                    }}
                                    variant="flat"
                                    className="font-medium"
                                >
                                    {profile.rank?.name || "Unranked"}
                                </Chip>
                                <Chip
                                    startContent={<HiLightningBolt className="text-xs" />}
                                    color="danger"
                                    variant="flat"
                                    className="font-medium"
                                >
                                    {profileUser.points} points
                                </Chip>
                            </div>
                        </div>
                        
                        {/* Stats Summary */}
                        <div className="flex-grow flex justify-end">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-gray-800/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">{profile.stats.totalSolved}</p>
                                    <p className="text-gray-400 text-sm">Problems Solved</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">{submissions.length}</p>
                                    <p className="text-gray-400 text-sm">Submissions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Navigation Tabs - Improved Style */}
                <div className="flex mb-6 border-b border-gray-800 overflow-x-auto">
                    <button 
                        type="button"
                        className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'overview' ? 'text-red-500 border-b-2 border-red-500 font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'} transition-colors`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <HiChartBar /> Overview
                    </button>
                    <button 
                        type="button"
                        className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'challenges' ? 'text-red-500 border-b-2 border-red-500 font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'} transition-colors`}
                        onClick={() => setActiveTab('challenges')}
                    >
                        <HiPuzzle /> Challenges
                    </button>
                    <button 
                        type="button"
                        className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'submissions' ? 'text-red-500 border-b-2 border-red-500 font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'} transition-colors`}
                        onClick={() => setActiveTab('submissions')}
                    >
                        <FaHistory /> Submissions
                    </button>
                </div>
                
                {/* Content based on active tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Progress Stats Card */}
                        <div className="bg-gray-900/70 border border-gray-800 col-span-1 lg:col-span-2 shadow-lg rounded-xl p-5">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <FaCode className="mr-2 text-red-500" /> Solved Problems
                            </h3>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-white font-medium">{profile.stats.totalSolved} solved</span>
                                </div>
                                <Progress 
                                    value={profile.stats.totalSolved} 
                                    maxValue={maxProblems} 
                                    color="danger"
                                    className="h-3 rounded-lg"
                                    showValueLabel={true}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-emerald-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
                                            Easy
                                        </span>
                                        <span className="text-white">{profile.stats.byDifficulty.easy}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.easy} maxValue={maxEasy} color="success" className="h-2 rounded-lg" />
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-amber-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-amber-400 mr-2" />
                                            Medium
                                        </span>
                                        <span className="text-white">{profile.stats.byDifficulty.medium}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.medium} maxValue={maxMedium} color="warning" className="h-2 rounded-lg" />
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-400 mr-2" />
                                            Hard
                                        </span>
                                        <span className="text-white">{profile.stats.byDifficulty.hard}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.hard} maxValue={maxHard} color="danger" className="h-2 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Rank Card */}
                        <div className="bg-gray-900/70 border border-gray-800 shadow-lg rounded-xl p-5">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <FaTrophy className="mr-2 text-red-500" /> Rank
                            </h3>
                            <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-b from-transparent to-gray-800/50 rounded-lg p-4">
                                {rankBadgeImage && (
                                    <img src={rankBadgeImage} alt="Rank" className="w-20 h-20 mb-3" />
                                )}
                                <h4 className="text-xl font-bold" style={{ color: rankStyle.textColor }}>
                                    {profile.rank?.name || 'Unranked'}
                                </h4>
                                <div className="mt-2 flex items-center">
                                    <HiLightningBolt className="text-red-500 mr-1" />
                                    <p className="text-red-500">{profileUser.points} points</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="bg-gray-900/70 border border-gray-800 col-span-1 lg:col-span-3 shadow-lg rounded-xl p-5">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                <FaHistory className="mr-2 text-red-500" /> Recent Submissions
                            </h3>
                            {submissions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table 
                                        aria-label="Recent submissions" 
                                        className="bg-transparent"
                                        classNames={{
                                            wrapper: "bg-gray-800/50 rounded-lg",
                                            th: "bg-gray-800/50 text-white border-b border-gray-700",
                                            td: "py-3 border-b border-gray-700/50",
                                            tbody: "bg-gray-800/30"
                                        }}
                                    >
                                        <TableHeader>
                                            <TableColumn>CHALLENGE</TableColumn>
                                            <TableColumn>DIFFICULTY</TableColumn>
                                            <TableColumn>STATUS</TableColumn>
                                            <TableColumn>LANGUAGE</TableColumn>
                                            <TableColumn>DATE</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.slice(0, 5).map((submission) => (
                                                <TableRow key={submission.id_submission} className="hover:bg-gray-700/30 transition-colors">
                                                    <TableCell>
                                                        <Link 
                                                            as={NextLink}
                                                            href={`/challenge/${submission.challenges.id_challenge}`}
                                                            className="text-white font-medium hover:text-red-500 transition-colors flex items-center gap-1"
                                                        >
                                                            <span className="truncate max-w-[200px]">{submission.challenges.title}</span>
                                                            <FaExternalLinkAlt className="text-xs flex-shrink-0" />
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            className={`${difficultyBgColors[submission.challenges.difficulty.toLowerCase()]} ${difficultyTextColors[submission.challenges.difficulty.toLowerCase()]} text-sm font-medium`}
                                                            size="sm" 
                                                            variant="flat"
                                                        >
                                                            {submission.challenges.difficulty}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            startContent={submission.is_correct ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                                                            color={submission.is_correct ? "success" : "danger"} 
                                                            size="sm" 
                                                            variant="flat"
                                                            className="font-medium"
                                                        >
                                                            {submission.status}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell className="text-white">{submission.programming_language}</TableCell>
                                                    <TableCell className="text-gray-400">
                                                        <div className="flex items-center whitespace-nowrap">
                                                            <FaCalendarAlt className="mr-1 text-xs flex-shrink-0" />
                                                            <span className="text-xs">{formatDate(submission.submitted_at)}</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <FaHistory className="mx-auto text-4xl text-gray-500 mb-3" />
                                    <p className="text-gray-400">No recent submissions found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'challenges' && (
                    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <HiPuzzle className="mr-2 text-red-500" /> Solved Challenges
                        </h3>
                        {challenges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {challenges.map((challenge) => (
                                    <div 
                                        key={challenge.id_challenge} 
                                        className="bg-gray-800/50 border border-gray-700 hover:shadow-lg transition-shadow cursor-pointer rounded-xl p-4"
                                    >
                                        <Link 
                                            as={NextLink}
                                            href={`/challenge/${challenge.id_challenge}`}
                                            className="block"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <h4 className="text-lg font-semibold text-white truncate">
                                                        {challenge.title}
                                                    </h4>
                                                    <FaExternalLinkAlt className="text-xs text-gray-400 flex-shrink-0" />
                                                </div>
                                                <Chip 
                                                    className={`${difficultyBgColors[challenge.difficulty.toLowerCase()]} ${difficultyTextColors[challenge.difficulty.toLowerCase()]} text-sm font-medium ml-2 flex-shrink-0`}
                                                    size="sm"
                                                >
                                                    {challenge.difficulty}
                                                </Chip>
                                            </div>
                                            <p className="text-gray-400 line-clamp-2 text-sm mb-4">
                                                {challenge.description?.substring(0, 100)}...
                                            </p>
                                            <Divider className="my-2 bg-gray-700" />
                                            <div className="flex justify-between text-sm items-center mt-2">
                                                <span className="text-gray-400 flex items-center">
                                                    <FaCode className="mr-1 text-xs" /> Solved
                                                </span>
                                                <Chip 
                                                    startContent={<FaCheck className="text-xs" />}
                                                    color="success" 
                                                    size="sm" 
                                                    variant="flat"
                                                    className="font-medium"
                                                >
                                                    Completed
                                                </Chip>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700">
                                <HiPuzzle className="mx-auto text-5xl text-gray-500 mb-3" />
                                <p className="text-gray-400 mb-2">No solved challenges yet.</p>
                                <p className="text-red-500 font-medium">Start solving to see your progress!</p>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'submissions' && (
                    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <FaHistory className="mr-2 text-red-500" /> Submission History
                        </h3>
                        {submissions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table 
                                    aria-label="Submission history" 
                                    className="bg-transparent min-w-full"
                                    classNames={{
                                        wrapper: "bg-gray-800/50 rounded-lg",
                                        th: "bg-gray-800/50 text-white border-b border-gray-700",
                                        td: "py-3 border-b border-gray-700/50",
                                        tbody: "bg-gray-800/30"
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>CHALLENGE</TableColumn>
                                        <TableColumn>DIFFICULTY</TableColumn>
                                        <TableColumn>STATUS</TableColumn>
                                        <TableColumn>LANGUAGE</TableColumn>
                                        <TableColumn>EXECUTION TIME</TableColumn>
                                        <TableColumn>MEMORY</TableColumn>
                                        <TableColumn>DATE</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.map((submission) => (
                                            <TableRow key={submission.id_submission} className="hover:bg-gray-700/30 transition-colors">
                                                <TableCell>
                                                    <Link 
                                                        as={NextLink}
                                                        href={`/challenge/${submission.challenges.id_challenge}`}
                                                        className="text-white font-medium hover:text-red-500 transition-colors flex items-center gap-1"
                                                    >
                                                        <span className="truncate max-w-[150px]">{submission.challenges.title}</span>
                                                        <FaExternalLinkAlt className="text-xs flex-shrink-0" />
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        className={`${difficultyBgColors[submission.challenges.difficulty.toLowerCase()]} ${difficultyTextColors[submission.challenges.difficulty.toLowerCase()]} text-sm font-medium`}
                                                        size="sm" 
                                                        variant="flat"
                                                    >
                                                        {submission.challenges.difficulty}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        startContent={submission.is_correct ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                                                        color={submission.is_correct ? "success" : "danger"} 
                                                        size="sm" 
                                                        variant="flat"
                                                        className="font-medium"
                                                    >
                                                        {submission.status}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell className="text-white text-sm">{submission.programming_language}</TableCell>
                                                <TableCell className="text-gray-400">
                                                    <div className="flex items-center whitespace-nowrap">
                                                        <FaClock className="mr-1 text-xs flex-shrink-0" />
                                                        <span className="text-xs">{submission.final_execution_time ? `${roundNumber(submission.final_execution_time)} ms` : 'N/A'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-400">
                                                    <div className="flex items-center whitespace-nowrap">
                                                        <FaMemory className="mr-1 text-xs flex-shrink-0" />
                                                        <span className="text-xs">{submission.final_memory_space ? `${roundNumber(submission.final_memory_space)} MB` : 'N/A'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-400">
                                                    <div className="flex items-center whitespace-nowrap">
                                                        <FaCalendarAlt className="mr-1 text-xs flex-shrink-0" />
                                                        <span className="text-xs">{formatDateTime(submission.submitted_at)}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700">
                                <FaHistory className="mx-auto text-5xl text-gray-500 mb-3" />
                                <p className="text-gray-400 mb-2">No submissions yet.</p>
                                <p className="text-red-500 font-medium">Start solving challenges to see your submission history!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
} 