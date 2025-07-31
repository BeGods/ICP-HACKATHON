import OverlayLayout from "../../Layouts/OverlayLayout";
import { useStore } from "../../../store/useStore";

const MoonInfoCard = () => {
  const assets = useStore((s) => s.assets);

  return (
    <OverlayLayout>
      <div className="center-section">
        <div className="relative card-width rounded-lg shadow-lg card-shadow-white">
          <div className="relative w-full h-full text-card">
            <img
              src={assets.uxui.bgInfoMoon}
              alt="info card background"
              className="w-full h-full object-cover rounded-primary z-10"
            />
          </div>
        </div>
      </div>
    </OverlayLayout>
  );
};

export default MoonInfoCard;
