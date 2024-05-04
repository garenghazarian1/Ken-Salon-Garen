import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-60 relative">
      <div className="animate-spin rounded-full w-auto h-auto border-t-4 border-gray-300 absolute"></div>
      <Image src="/logo01.png" alt="loading" width={100} height={100} style={{ width: 'auto', height: 'auto' }}/>
    </div>
  );
}
