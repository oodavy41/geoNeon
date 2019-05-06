import React, { Component } from "react";
import "./linePicker.css";
export default class LinePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      line: 0
    };
    this.lines = [
      { name: "All", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "AU", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "BSW", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "MD", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "ES", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "AF", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "KR", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "EAM", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "EAW", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "SAM", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "JP", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "EU", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "FE", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) },
      { name: "TW", color: "#" + ((Math.random() * 0xffffff) << 0).toString(16) }
    ];
    console.log(this.lines);
  }

  render() {
    return (
      <div id="line_pick">
        {this.lines.map((e, i) => (
          <div class="line_picker">
            <input type="radio" name="line" key={i} value={i} style={{ background: e.color }} checked/>
            <span>{e.name}</span>
          </div>
        ))}
      </div>
    );
  }
}
