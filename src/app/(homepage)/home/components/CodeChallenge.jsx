export default function CodeChallenge() {

    //TODO: Incorporar todo lo del Backend como incluir el fetch para obtener los datos de la API como Server Component e incluir
    //TODO: un skeleton para el cargado de datos. De igual forma manejo de View Challenge con el botón para navegar
    
    // Función para determinar las clases de estilo según la dificultad
    const getDifficultyStyles = (difficulty) => {
        switch(difficulty.toLowerCase()) {
            case 'easy':
                return {
                    bg: 'bg-[#05966933]',
                    text: 'text-[#34D399]'
                };
            case 'medium':
                return {
                    bg: 'bg-[#D9770633]',
                    text: 'text-[#FBBF24]'
                };
            case 'hard':
                return {
                    bg: 'bg-[#DC262633]',
                    text: 'text-[#F87171]'
                };
            default:
                return {
                    bg: 'bg-[#D9770633]',
                    text: 'text-[#FBBF24]'
                };
        }
    };
    
    // Ejemplo de dificultad
    const difficulty = "Medium";
    const difficultyStyles = getDifficultyStyles(difficulty);
    
    return (
        <div className="flex min-h-screen items-center justify-center w-full px-6">
            <div className="w-full max-w-[450px] bg-mahindra-dark-blue rounded-xl p-6 relative font-mono">
                {/* Badge de dificultad */}
                <div className="flex justify-between items-center mb-4">
                    <div className={`inline-block ${difficultyStyles.bg} ${difficultyStyles.text} text-sm font-medium rounded-full px-4 py-1`}>
                        {difficulty}
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