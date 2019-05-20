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
    this.colors = [];
    for (let i = 0; i < this.lines.length; i++) {
      this.colors.push("#" + ((Math.random() * 0xffffff) << 0).toString(16));
    }
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
            <div className="line_picker" key={i}>
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
