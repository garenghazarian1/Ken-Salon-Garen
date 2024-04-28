

export default function Logo() {
  return (
    <div className="flex items-center justify-center pl-2">
      <div className="p-2 relative overflow-hidden"> 
        <img
          src="/logo01.png"
          alt="logo"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
