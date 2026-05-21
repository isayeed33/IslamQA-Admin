import { useState } from "react";

const MaximizeScreen = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsMaximized(true);
    } else {
      document.exitFullscreen();
      setIsMaximized(false);
    }
  };

  return (
    <button type="button" className="nav-link p-2 hidden md:flex" onClick={toggleFullscreen}>
      <span className="sr-only">Maximize</span>
      <span className="flex items-center justify-center h-6 w-6">
        <i className={`mgc_${isMaximized ? 'minimize' : 'fullscreen'}_line text-xl`}></i>
      </span>
    </button>
  );
};

export default MaximizeScreen;
