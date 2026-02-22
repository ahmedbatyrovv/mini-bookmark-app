import { useState, useEffect } from "react";
import axios from "axios";
import BookmarkCard from "./components/BookmarkCard";
import BookmarkFormModal from "./components/BookmarkFormModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Toast from "./components/Toast";
import SearchAndSort from "./components/SearchAndSort";
import EmptyState from "./components/EmptyState";

const THEME_KEY = "theme-preference";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [deletingBookmark, setDeletingBookmark] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Тема — остаётся как было
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Загрузка закладок с сервера (при монтировании + при изменении поиска/сортировки)
  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (sortBy === "alphabetical") {
          params.sort = "title";
        } else if (sortBy === "category") {
          params.sort = "category";
        } else {
          params.sort = "createdAt"; // newest по умолчанию
        }

        const response = await axios.get(
          "http://localhost:5000/api/bookmarks",
          { params },
        );
        setBookmarks(response.data || []);
      } catch (err) {
        console.error("Ошибка загрузки закладок:", err);
        setError(
          "Не удалось загрузить закладки. Проверьте, запущен ли сервер.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [searchQuery, sortBy]);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setIsFormOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (bookmark) => {
    setDeletingBookmark(bookmark);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBookmark?._id) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/bookmarks/${deletingBookmark._id}`,
      );
      setBookmarks((prev) =>
        prev.filter((b) => b._id !== deletingBookmark._id),
      );
      showToast("Закладка удалена!", "error");
    } catch (err) {
      console.error("Ошибка удаления:", err);
      showToast("Не удалось удалить закладку", "error");
    }

    setIsDeleteModalOpen(false);
    setDeletingBookmark(null);
  };

  const handleSaveBookmark = async (formData) => {
    try {
      let response;

      if (editingBookmark) {
        // Обновление существующей
        response = await axios.put(
          `http://localhost:5000/api/bookmarks/${editingBookmark._id}`,
          formData,
        );
        setBookmarks((prev) =>
          prev.map((b) => (b._id === editingBookmark._id ? response.data : b)),
        );
        showToast("Закладка обновлена!");
      } else {
        // Создание новой
        response = await axios.post(
          "http://localhost:5000/api/bookmarks",
          formData,
        );
        setBookmarks((prev) => [response.data, ...prev]);
        showToast("Закладка добавлена!");
      }
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      showToast("Не удалось сохранить закладку", "error");
    }

    setIsFormOpen(false);
    setEditingBookmark(null);
  };

  // Пока идёт загрузка
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Загрузка закладок...
        </div>
      </div>
    );
  }

  // Ошибка загрузки
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Ошибка</div>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Мои закладки
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Храни все любимые места в одном месте
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title={isDarkMode ? "Светлая тема" : "Темная тема"}
          >
            {isDarkMode ? (
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {bookmarks.length > 0 && (
          <SearchAndSort
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {bookmarks.length === 0 && searchQuery === "" ? (
          <EmptyState onAddClick={handleAddBookmark} />
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Ничего не найдено
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleAddBookmark}
          className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-200 hover:scale-110 flex items-center justify-center group"
          title="Добавить закладку"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <BookmarkFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBookmark(null);
        }}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBookmark(null);
        }}
        onConfirm={handleConfirmDelete}
        bookmarkTitle={deletingBookmark?.title || ""}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
