export default function ActionButtons() {
  return (
      <div className="flex gap-3 font-mono justify-end">
          {/* Botón Volver a generar */}
          <button className="flex items-center justify-center bg-mahindra-red text-mahindra-white py-3 px-6 rounded-md">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V1L8 5l4 4V6a8 8 0 1 1-8 8h2a6 6 0 1 0 6-6z" fill="currentColor" />
            </svg>
            Volver a generar
          </button>

          {/* Botón Aprobar */}
          <button className="flex items-center justify-center bg-green-600 text-mahindra-white py-3 px-6 rounded-md">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Aprobar
          </button>
      </div>
  );
};