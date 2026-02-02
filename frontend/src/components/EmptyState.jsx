function EmptyState({ onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="text-8xl mb-6">📍</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Нет закладок
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
        Добавь свои любимые места! Сохраняй рестораны, кафе, пляжи и другие интересные локации.
      </p>
      <button
        onClick={onAddClick}
        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      >
        Добавить первую закладку
      </button>
    </div>
  );
}

export default EmptyState;
