export default function CodeChallenge({challenge }) {
    const difficultyColors = {
        Easy: "bg-emerald-700/30 text-emerald-400",
        Medium: "bg-amber-700/30 text-amber-400",
        Hard: "bg-red-700/30 text-red-400"
    };

    const difficultyBasePoints = {
        Easy: 100,
        Medium: 200,
        Hard: 300
    }

    const badgeColor = difficultyColors[challenge?.difficulty];
    const basePoints = difficultyBasePoints[challenge?.difficulty];
    return (
        <div className="w-full h-[220px]">
            <div className="w-full h-full bg-mahindra-dark-blue rounded-xl p-6 relative font-mono transition-transform duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between">
                <div>
                    {/* Badge de dificultad y fecha en la parte superior */}
                    <div className="flex justify-between items-center mb-3">
                        <div className={`inline-block ${badgeColor} text-sm font-medium rounded-full px-4 py-1`}>
                            {challenge?.difficulty}
                        </div>
                        
                        {/* Fecha - ahora en la parte superior */}
                        <div className="flex items-center">
                            <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Due date">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-mahindra-white font-semibold">
                                    {challenge?.deadline ? new Date(challenge.deadline).toLocaleDateString() : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Título del desafío */}
                    <h1 className="text-2xl font-bold text-mahindra-white line-clamp-1">
                        {challenge?.title}
                    </h1>
                    
                    {/* Descripción del desafío */}
                    <p className="mt-2 text-mahindra-light-gray text-sm line-clamp-2">
                        {challenge?.description}
                    </p>
                </div>
                
                {/* Footer con puntos y botón */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                        {/* Icono de puntos */}
                        <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Points">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-mahindra-white font-semibold">{basePoints || 0}</span>
                            <span className="text-mahindra-light-gray text-sm ml-1">pts</span>
                        </div>
                    </div>
                    
                    {/* Botón de View Challenge */}
                    <button type="button" className="text-mahindra-red hover:text-mahindra-red font-medium text-sm flex items-center transition-transform hover:translate-x-1 group">
                        View Challenge
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" title="Arrow right">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}