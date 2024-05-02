
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-60 relative">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-gray-300 absolute"></div>
      <img src="logo01.png" alt="loading" style={{ height: '80px', width: '80px' }} />
    </div>
  );
}
