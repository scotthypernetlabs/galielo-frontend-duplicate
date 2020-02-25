import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
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
        <FontAwesomeIcon
          icon={faClipboardList}
          style={{ marginLeft: 5, marginRight: 5 }}
        />{" "}
        Station Activity
      </span>
    </div>
  );
};

export default StationJobsHeader;
