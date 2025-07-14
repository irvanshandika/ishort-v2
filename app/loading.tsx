export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">iShort</h2>
        <p className="text-gray-600 dark:text-gray-300">Loading your URL shortening experience...</p>
      </div>
    </div>
  );
}
