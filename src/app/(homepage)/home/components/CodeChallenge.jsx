export default function CodeChallenge() {
    
    return (
        <div className="flex min-h-screen items-center justify-center w-full px-6">
            <div className="w-full max-w-[450px] bg-mahindra-black rounded-xl p-6 relative font-mono">
                {/* Badge de dificultad y fecha en la parte superior */}
                <div className="flex justify-between items-center mb-4">
                    <div className="inline-block bg-amber-700/30 text-amber-400 text-sm font-medium rounded-full px-4 py-1">
                        Medium
                    </div>
                    
                    {/* Fecha - ahora en la parte superior */}
                    <div className="flex items-center">
                        <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-mahindra-white font-semibold">30/04/2025</span>
                        </div>
                    </div>
                </div>
                
                {/* Título del desafío */}
                <h1 className="text-2xl font-bold text-mahindra-white">Binary Tree Traversal</h1>
                
                {/* Descripción del desafío */}
                <p className="mt-2 text-mahindra-light-gray text-sm">
                    Implement three different methods to traverse a binary tree structure.
                </p>
                
                {/* Footer con puntos y botón */}
                <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center">
                        {/* Icono de puntos */}
                        <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-mahindra-white font-semibold">100</span>
                            <span className="text-mahindra-light-gray text-sm ml-1">pts</span>
                        </div>
                    </div>
                    
                    {/* Botón de View Challenge */}
                    <button className="text-mahindra-red hover:text-mahindra-red/80 font-medium text-sm flex items-center">
                        View Challenge
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}