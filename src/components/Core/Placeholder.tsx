import * as React from "react";

export interface PlaceholderProps {}

const Placeholder: React.SFC<PlaceholderProps> = (props: PlaceholderProps) => {
  return <div>{"Placeholder..."}</div>;
};

export default Placeholder;
