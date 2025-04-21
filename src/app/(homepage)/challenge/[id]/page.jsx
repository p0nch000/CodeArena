export default function CodeChallengeSolve({ params }) {

    const { id } =  params;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-white">Code Challenge Solve number {id}</h1>
            <p className="text-lg text-white">This is the Code Challenge Solve page.</p>
        </div>
    );
}