import Link from 'next/link';

export default function FeaturedCodeChallenge({ challenge }) {
    // If no challenge is available, display a placeholder
    if (!challenge) {
        return (
            <div className="w-full bg-mahindra-dark-blue rounded-xl p-6 font-mono text-mahindra-white">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="inline-block bg-mahindra-red/20 text-mahindra-red text-sm font-medium rounded-full px-4 py-1">
                            Featured Challenge
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-mahindra-white mb-2">
                        No featured challenge available
                    </h1>
                    <p className="text-mahindra-light-gray text-base max-w-3xl mb-4">
                        Check back soon for new coding challenges.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-mahindra-dark-blue rounded-xl p-6 font-mono text-mahindra-white transition-transform duration-300 hover:scale-[1.01] cursor-pointer">
            <div className="flex flex-col">
                {/* Header with badge and button */}
                <div className="flex justify-between items-center mb-4">
                    <div className="inline-block bg-mahindra-red/20 text-mahindra-red text-sm font-medium rounded-full px-4 py-1">
                        Featured Challenge
                    </div>
                    
                    <Link 
                        href={`/challenge/${challenge?.id_challenge}`}
                        className="hidden sm:block bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105"
                    >
                        Start Challenge
                    </Link>
                </div>
                
                {/* Challenge title */}
                <h1 className="text-3xl font-bold text-mahindra-white mb-2">
                    {challenge.title}
                </h1>
                
                {/* Challenge description */}
                <p className="text-mahindra-light-gray text-base max-w-3xl mb-4">
                    {challenge.description}
                </p>
                
                {/* Mobile button (only visible on small screens) */}
                <Link 
                    href={`/challenge/${challenge?.id_challenge}`}
                    className="sm:hidden w-full bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105 mt-4 text-center"
                >
                    Start Challenge
                </Link>
            </div>
        </div>
    );
}