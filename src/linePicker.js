import React, { Component } from "react";
import style from "./sources/linePicker.css";

export default class LinePicker extends Component {
  constructor(props) {
    super(props);
    this.init = true;
    this.state = {
      line: 0
    };
    this.lines = Object.keys(this.props.areaInfo);
    this.lines.push("All");
    this.colors = [
      "#4d3080",
      "#062e6b",
      "#4e7191",
      "#2e681e",
      "#446014",
      "#857c2f",
      "#703c15",
      "#33458d",
      "#852e39",
      "#864972",
      "#835d1c",
      "#053d4c",
      "#847c30",
      "#4d3080",
      "#062e6b",
      "#4e7191",
      "#2e681e",
      "#446014",
      "#857c2f",
      "#703c15",
      "#33458d",
      "#852e39",
      "#864972",
      "#835d1c",
      "#053d4c",
      "#847c30"
    ];
    console.log(this.lines);
  }

  change(value) {
    this.props.onchange(value);
    this.init = false;
  }

  render() {
    return (
      <div className={style.line_pick}>
        {this.lines.map((e, i) => {
          return (
            <div className={style.line_picker} key={i}>
              <input
                onClick={() => this.change(e)}
                type="radio"
                name="line"
                key={i}
                value={e}
                style={{ background: this.colors[i] }}
                checked={this.init ? i == this.lines.length - 1 : null}
              />
              <span>{e}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
