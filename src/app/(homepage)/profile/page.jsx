"use client";
import { useAuth } from '@/core/context/AuthContext';
import { useEffect, useState } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { Card, CardBody, Progress, Divider, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react';
import { getBadgeStyles, getRankBadgeImage } from '@/utils/ranks';
import { FaTrophy, FaCode, FaHistory, FaCheck, FaTimes, FaCalendarAlt, FaMemory, FaClock } from 'react-icons/fa';
import { HiLightningBolt, HiChartBar, HiPuzzle } from 'react-icons/hi';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const profileRes = await fetch(`/api/user/profile?userId=${user.id}`);
            const profileData = await profileRes.json();
            const challengesRes = await fetch(`/api/user/challenges?userId=${user.id}`);
            const challengesData = await challengesRes.json();
            const submissionsRes = await fetch(`/api/user/submissions?userId=${user.id}&limit=10`);
            const submissionsData = await submissionsRes.json();
            
            if (profileData.success) setProfile(profileData.profile);
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
            <div className="flex justify-center items-center h-[70vh]">
                <Spinner size="lg" color="danger" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-mahindra-white">
                <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
                <p>We couldn't load your profile data. Please try again later.</p>
            </div>
        );
    }

    const difficultyColor = {
        easy: 'success',
        medium: 'warning',
        hard: 'danger'
    };
    
    const rankStyle = profile.rank ? getBadgeStyles(profile.rank.name) : getBadgeStyles(null);
    const rankBadgeImage = profile.rank ? getRankBadgeImage(profile.rank.name) : null;

    return (
        <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono">
            {/* Profile Header - Modern Card with Background Gradient */}
            <div className="w-full bg-gradient-to-r from-mahindra-dark-blue to-mahindra-blue border border-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div className="w-28 h-28 rounded-full ring-2 ring-mahindra-red ring-offset-2 ring-offset-mahindra-blue overflow-hidden">
                        <UserAvatar user={user} size="lg" className="w-full h-full" />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-2xl font-bold text-mahindra-white">{profile.user.username}</h1>
                        <p className="text-gray-300 mb-2">{profile.user.role}</p>
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
                                {profile.user.points} points
                            </Chip>
                        </div>
                    </div>
                    
                    {/* Stats Summary */}
                    <div className="flex-grow flex justify-end">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-mahindra-blue/40 rounded-lg p-3">
                                <p className="text-2xl font-bold text-mahindra-white">{profile.stats.totalSolved}</p>
                                <p className="text-gray-400 text-sm">Problems Solved</p>
                            </div>
                            <div className="bg-mahindra-blue/40 rounded-lg p-3">
                                <p className="text-2xl font-bold text-mahindra-white">{submissions.length}</p>
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
                    className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'overview' ? 'text-mahindra-red border-b-2 border-mahindra-red font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-mahindra-blue/20'} transition-colors`}
                    onClick={() => setActiveTab('overview')}
                >
                    <HiChartBar /> Overview
                </button>
                <button 
                    type="button"
                    className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'challenges' ? 'text-mahindra-red border-b-2 border-mahindra-red font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-mahindra-blue/20'} transition-colors`}
                    onClick={() => setActiveTab('challenges')}
                >
                    <HiPuzzle /> Challenges
                </button>
                <button 
                    type="button"
                    className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'submissions' ? 'text-mahindra-red border-b-2 border-mahindra-red font-medium' : 'text-gray-400 hover:text-gray-300 hover:bg-mahindra-blue/20'} transition-colors`}
                    onClick={() => setActiveTab('submissions')}
                >
                    <FaHistory /> Submissions
                </button>
            </div>
            
            {/* Content based on active tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Progress Stats Card */}
                    <Card className="bg-mahindra-dark-blue border border-gray-800 col-span-1 lg:col-span-2 shadow-lg">
                        <CardBody>
                            <h3 className="text-xl font-bold text-mahindra-white mb-4 flex items-center">
                                <FaCode className="mr-2 text-mahindra-red" /> Solved Problems
                            </h3>
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-300">Total</span>
                                    <span className="text-mahindra-white font-medium">{profile.stats.totalSolved} solved</span>
                                </div>
                                <Progress 
                                    value={profile.stats.totalSolved} 
                                    maxValue={100} 
                                    color="danger"
                                    className="h-3 rounded-lg"
                                    showValueLabel={true}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-mahindra-blue/30 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-green-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-green-400 mr-2" />
                                            Easy
                                        </span>
                                        <span className="text-mahindra-white">{profile.stats.byDifficulty.easy}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.easy} maxValue={50} color="success" className="h-2 rounded-lg" />
                                </div>
                                <div className="bg-mahindra-blue/30 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-yellow-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2" />
                                            Medium
                                        </span>
                                        <span className="text-mahindra-white">{profile.stats.byDifficulty.medium}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.medium} maxValue={50} color="warning" className="h-2 rounded-lg" />
                                </div>
                                <div className="bg-mahindra-blue/30 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-400 font-medium flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-400 mr-2" />
                                            Hard
                                        </span>
                                        <span className="text-mahindra-white">{profile.stats.byDifficulty.hard}</span>
                                    </div>
                                    <Progress value={profile.stats.byDifficulty.hard} maxValue={50} color="danger" className="h-2 rounded-lg" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    
                    {/* Rank Card */}
                    <Card className="bg-mahindra-dark-blue border border-gray-800 shadow-lg">
                        <CardBody>
                            <h3 className="text-xl font-bold text-mahindra-white mb-4 flex items-center">
                                <FaTrophy className="mr-2 text-mahindra-red" /> Rank
                            </h3>
                            <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-b from-transparent to-mahindra-blue/20 rounded-lg p-4">
                                {rankBadgeImage && (
                                    <img src={rankBadgeImage} alt="Rank" className="w-20 h-20 mb-3" />
                                )}
                                <h4 className="text-xl font-bold" style={{ color: rankStyle.textColor }}>
                                    {profile.rank?.name || 'Unranked'}
                                </h4>
                                <div className="mt-2 flex items-center">
                                    <HiLightningBolt className="text-mahindra-red mr-1" />
                                    <p className="text-mahindra-red">{profile.user.points} points</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    
                    {/* Recent Activity */}
                    <Card className="bg-mahindra-dark-blue border border-gray-800 col-span-1 lg:col-span-3 shadow-lg">
                        <CardBody>
                            <h3 className="text-xl font-bold text-mahindra-white mb-4 flex items-center">
                                <FaHistory className="mr-2 text-mahindra-red" /> Recent Submissions
                            </h3>
                            {submissions.length > 0 ? (
                                <Table 
                                    aria-label="Recent submissions" 
                                    className="bg-transparent"
                                    classNames={{
                                        th: "bg-mahindra-blue/30 text-mahindra-white",
                                        td: "py-3"
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
                                            <TableRow key={submission.id_submission} className="hover:bg-mahindra-blue/10">
                                                <TableCell className="text-mahindra-white font-medium">{submission.challenges.title}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        color={difficultyColor[submission.challenges.difficulty.toLowerCase()]} 
                                                        size="sm" 
                                                        variant="flat"
                                                        className="font-medium"
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
                                                <TableCell className="text-mahindra-white">{submission.programming_language}</TableCell>
                                                <TableCell className="text-gray-400 flex items-center">
                                                    <FaCalendarAlt className="mr-2 text-xs" />
                                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-12 bg-mahindra-blue/10 rounded-lg border border-mahindra-blue/30">
                                    <FaHistory className="mx-auto text-4xl text-gray-500 mb-3" />
                                    <p className="text-gray-400">No recent submissions found.</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            )}
            
            {activeTab === 'challenges' && (
                <div className="bg-mahindra-dark-blue border border-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-mahindra-white mb-6 flex items-center">
                        <HiPuzzle className="mr-2 text-mahindra-red" /> Solved Challenges
                    </h3>
                    {challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {challenges.map((challenge) => (
                                <Card 
                                    key={challenge.id_challenge} 
                                    className="bg-gradient-to-br from-mahindra-blue to-mahindra-dark-blue border border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                                    isPressable
                                >
                                    <CardBody>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-lg font-semibold text-mahindra-white">{challenge.title}</h4>
                                            <Chip 
                                                color={difficultyColor[challenge.difficulty.toLowerCase()]} 
                                                size="sm"
                                                className="font-medium"
                                            >
                                                {challenge.difficulty}
                                            </Chip>
                                        </div>
                                        <p className="text-gray-300 line-clamp-2 text-sm mb-4">
                                            {challenge.description?.substring(0, 100)}...
                                        </p>
                                        <Divider className="my-2" />
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
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-mahindra-blue/10 rounded-lg border border-mahindra-blue/30">
                            <HiPuzzle className="mx-auto text-5xl text-gray-500 mb-3" />
                            <p className="text-gray-400 mb-2">No solved challenges yet.</p>
                            <p className="text-mahindra-red font-medium">Start solving to see your progress!</p>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'submissions' && (
                <div className="bg-mahindra-dark-blue border border-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-mahindra-white mb-6 flex items-center">
                        <FaHistory className="mr-2 text-mahindra-red" /> Submission History
                    </h3>
                    {submissions.length > 0 ? (
                        <Table 
                            aria-label="Submission history" 
                            className="bg-transparent"
                            classNames={{
                                th: "bg-mahindra-blue/30 text-mahindra-white",
                                td: "py-3"
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
                                    <TableRow key={submission.id_submission} className="hover:bg-mahindra-blue/10">
                                        <TableCell className="text-mahindra-white font-medium">{submission.challenges.title}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                color={difficultyColor[submission.challenges.difficulty.toLowerCase()]} 
                                                size="sm" 
                                                variant="flat"
                                                className="font-medium"
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
                                        <TableCell className="text-mahindra-white">{submission.programming_language}</TableCell>
                                        <TableCell className="text-gray-400 flex items-center">
                                            <FaClock className="mr-2 text-xs" />
                                            {submission.final_execution_time ? `${submission.final_execution_time} ms` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-gray-400 flex items-center">
                                            <FaMemory className="mr-2 text-xs" />
                                            {submission.final_memory_space ? `${submission.final_memory_space} MB` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-gray-400 flex items-center">
                                            <FaCalendarAlt className="mr-2 text-xs" />
                                            {new Date(submission.submitted_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-16 bg-mahindra-blue/10 rounded-lg border border-mahindra-blue/30">
                            <FaHistory className="mx-auto text-5xl text-gray-500 mb-3" />
                            <p className="text-gray-400 mb-2">No submissions yet.</p>
                            <p className="text-mahindra-red font-medium">Start solving challenges to see your submission history!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}