// components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl shadow bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-10 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  );
}
