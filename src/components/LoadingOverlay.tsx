import { createPortal } from "react-dom";
import Spinner from "./Spinner";

const LoadingOverlay = () => {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#121212]">
      <Spinner />
    </div>,
    document.body
  );
};

export default LoadingOverlay;