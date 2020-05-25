import React, { Component } from "react";
import styles from "./linePicker.css";

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
      "#ADCCFF",
      "#FF4D4F",
      "#D46B08",
      "#7CB305",
      "#52C41A",
      "#597EF7",
      "#FF85C0",
      "#08979C",
      "#9254DE",
      "#91D5FF",
      "#FFEC3D",
      "#0050B3",
      "#006D75",
      "#FAAD14"
    ];
    console.log(this.lines);
  }

  change(value) {
    this.props.onchange(value);
    this.init = false;
  }

  render() {
    return (
      <div className={styles.line_pick}>
        {this.lines.map((e, i) => {
          return (
            <div className={styles.line_picker} key={i}>
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
