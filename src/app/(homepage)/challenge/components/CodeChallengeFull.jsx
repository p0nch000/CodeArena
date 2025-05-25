import Link from 'next/link';

export default function CodeChallengeFull({ challenge }) {
    // Mapeo de colores de badge según dificultad
    const badgeColors = {
        'Easy': 'bg-emerald-700/30 text-emerald-400',
        'Medium': 'bg-amber-700/30 text-amber-400',
        'Hard': 'bg-red-700/30 text-red-400'
    };

    // Mapeo de puntos según dificultad
    const difficultyPoints = {
        'Easy': 50,
        'Medium': 100,
        'Hard': 150
    };

    // Obtener el color de badge y los puntos según la dificultad
    const badgeColor = challenge.badgeColor || badgeColors[challenge.difficulty] || badgeColors['Medium'];
    const points = challenge.points || difficultyPoints[challenge.difficulty] || 100;
    
    // Extraer solo la fecha del deadline (formato YYYY-MM-DD)
    const formattedDeadline = challenge.deadline ? challenge.deadline.split('T')[0] : '';
        
    return (
        <div className="w-full bg-mahindra-dark-blue rounded-xl p-6 font-mono text-mahindra-white transition-transform duration-300 hover:scale-[1.01] cursor-pointer">
            <div className="flex flex-col">
                {/* Badge de dificultad y fecha en la parte superior */}
                <div className="flex justify-between items-center mb-3">
                    <div className={`inline-block ${badgeColor} text-sm font-medium rounded-full px-4 py-1`}>
                        {challenge.difficulty}
                    </div>
                    
                    {/* Fecha - ahora en la parte superior */}
                    <div className="flex items-center">
                        <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-mahindra-white font-semibold">{formattedDeadline}</span>
                        </div>
                    </div>
                </div>
                
                {/* Título del desafío */}
                <h1 className="text-3xl font-bold text-mahindra-white mb-2">{challenge.title}</h1>
                
                {/* Descripción del desafío */}
                <p className="text-mahindra-light-gray text-base mb-4">
                    {challenge.description}
                </p>
                
                {/* Created by */}
                <div className="text-mahindra-light-gray text-sm mb-4">
                    Created by: <span className="text-mahindra-white">{challenge.creator}</span>
                </div>
                
                {/* Footer con puntos y botón */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                        {/* Icono de puntos */}
                        <div className="bg-mahindra-black/40 rounded-full p-1 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-mahindra-light-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-mahindra-white font-semibold">{points}</span>
                            <span className="text-mahindra-light-gray text-sm ml-1">pts</span>
                        </div>
                    </div>
                    
                    {/* Reemplazando el botón por un Link */}
                    <Link 
                        href={`/challenge/${challenge.id_challenge}`}
                        className="hidden sm:block bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105"
                    >
                        Start Challenge
                    </Link>
                </div>
            </div>
        </div>
    );
}