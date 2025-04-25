import { Generator } from "./components";
import { ActionButtons } from "./components";
import { ChallengeGenerated } from "./components";

export default function Create() {
  return (
    <div className="flex flex-col w-full px-8 py-8 max-w-screen-2xl mx-auto font-mono">
      {/* Título y subtítulo */}
      <div className="py-6 px-2 mb-4">
        <h1 className="text-4xl font-bold text-white">Generador de Code Challenges</h1>
        <p className="text-sm text-gray-400 mt-1">Potenciado por Deepseek</p>
      </div>

      {/* Contenedor de los componentes */}
      <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
        <div className="w-full bg-gray-900 rounded-xl p-6">
          <Generator />
        </div>
        <div className="w-full bg-gray-900 rounded-xl p-6">
          <ChallengeGenerated />
        </div>
        <div className="w-full bg-gray-900 rounded-xl p-6 self-end">
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}