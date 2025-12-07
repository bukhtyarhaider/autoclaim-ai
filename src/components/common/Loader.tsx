type LoaderProps = {
  fullScreen?: boolean;   // true = full viewport, false = inline only
  size?: number;         // logo + container size (default 96px)
  show?: boolean;        // toggle visibility
  darkBg?: boolean;      // black background or transparent
};

const Loader = ({
  fullScreen = true,
  size = 96,
  show = true,
  darkBg = true,
}: LoaderProps) => {
  if (!show) return null;

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen w-screen" : ""
      } ${darkBg ? "bg-black" : "bg-transparent"}`}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Ping Animation */}
        <div className="absolute inset-0 bg-white rounded-xl opacity-20 animate-ping"></div>

        {/* Logo Container */}
        <div className="relative flex items-center justify-center w-full h-full bg-black rounded-xl shadow-xl border border-gray-800">
          <img
            src="/logo.png"
            alt="Loading..."
            style={{ width: size * 0.5, height: size * 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
