import { ButtonLayout } from "../../Layouts/ButtonLayout";
import CharacterCrd from "../Relics/CharacterCrd";

const CharPayCrd = ({ id, handClick }) => {
  return (
    <OverlayLayout>
      <div className="flex flex-col absolute pt-gamePanelTop">
        <div className="flex gap-3">{/* Balance */}</div>
      </div>
      <div className="center-section">
        <CharacterCrd id={id} />
      </div>
      <div className="absolute flex justify-center w-full bottom-0 mb-safeBottom">
        <ButtonLayout mode="default" onClick={handClick} />
      </div>
    </OverlayLayout>
  );
};

export default CharPayCrd;
