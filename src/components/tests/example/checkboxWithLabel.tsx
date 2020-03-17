import * as React from "react";
type State = {
  isChecked: boolean;
};

type Props = {
  labelOn: string;
  labelOff: string;
};

export class CheckboxWithLabel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isChecked: false };
  }

  onChange() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render() {
    return (
      <label>
        <input
          type="checkbox"
          checked={this.state.isChecked}
          onChange={this.onChange}
        />
        {this.state.isChecked ? this.props.labelOn : this.props.labelOff}
      </label>
    );
  }
}
