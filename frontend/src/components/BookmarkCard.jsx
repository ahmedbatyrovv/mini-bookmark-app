const getCategoryEmoji = (category) => {
  const emojis = {
    'Food': '🍔',
    'Beach': '🏖️',
    'Shopping': '🛍️',
    'Cafe': '☕',
    'Travel': '✈️',
    'Other': '📌'
  };
  return emojis[category] || '❓';
};

function BookmarkCard({ bookmark, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 animate-fade-in hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{getCategoryEmoji(bookmark.category)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(bookmark)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Редактировать"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(bookmark)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Удалить"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {bookmark.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {bookmark.description || 'Без описания'}
      </p>

      {bookmark.url && (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Открыть ссылку
        </a>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
          {bookmark.category}
        </span>
      </div>
    </div>
  );
}

export default BookmarkCard;
