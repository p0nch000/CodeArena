export default function FeaturedCodeChallenge() {
    // Mock data
    const featuredChallenge = {
        title: "Algorithm Optimization Challenge",
        description: "Optimize a complex sorting algorithm to achieve the best possible time complexity while maintaining space efficiency.",
        difficulty: "Medium",
        points: 150,
        dueDate: "05/05/2025"
    };

    return (
        <div className="w-full bg-mahindra-dark-blue rounded-xl p-6 font-mono text-mahindra-white">
            <div className="flex flex-col">
                {/* Header with badge and button */}
                <div className="flex justify-between items-center mb-4">
                    <div className="inline-block bg-mahindra-red/20 text-mahindra-red text-sm font-medium rounded-full px-4 py-1">
                        Featured Challenge
                    </div>
                    
                    <button className="hidden sm:block bg-mahindra-red hover:bg-mahindra-red/90 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                        Start Challenge
                    </button>
                </div>
                
                {/* Challenge title */}
                <h1 className="text-3xl font-bold text-mahindra-white mb-2">
                    {featuredChallenge.title}
                </h1>
                
                {/* Challenge description */}
                <p className="text-mahindra-light-gray text-base max-w-3xl mb-4">
                    {featuredChallenge.description}
                </p>
                
                {/* Mobile button (only visible on small screens) */}
                <button className="sm:hidden w-full bg-mahindra-red hover:bg-mahindra-red/90 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors mt-4">
                    Start Challenge
                </button>
            </div>
        </div>
    );
}