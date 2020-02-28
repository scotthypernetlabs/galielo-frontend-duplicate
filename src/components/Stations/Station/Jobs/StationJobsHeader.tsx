import { darkGrey } from "../../../theme";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import IconText from "../../../Core/IconText";
import React from "react";

interface StationJobsHeaderProps {
  setMode: Function;
}

const StationJobsHeader: React.SFC<StationJobsHeaderProps> = (
  props: StationJobsHeaderProps
) => {
  const { setMode } = props;
  return (
    <div
      className="section-header station-jobs-header-collapsed"
      onClick={setMode("Jobs")}
    >
      <span>
        <IconText
          icon={faClipboardList}
          text=" Station Activity"
          textVariant="h5"
          textColor={darkGrey.main}
        />
      </span>
    </div>
  );
};

export default StationJobsHeader;
