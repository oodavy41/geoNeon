import React, { Component } from "react";
import style from "./sources/linePicker.css";

export default class LinePicker extends Component {
  constructor(props) {
    super(props);
    this.init = true;
    this.state = {
      line: 0
    };
    this.lines = [];
    // for (let key in this.props.areas) {
    //   let e = this.props.areas[key]
    //   this.lines.push({ N: e, C: key })
    // }

    this.lines.push(
      { N: "北美", C: 169, L: 7326723, color: "#4d3080" },
      { N: "西北欧", C: 135, L: 5342380, color: "#062e6b" },
      { N: "南美", C: 110, L: 2584930, color: "#4e7191" },
      { N: "东南亚", C: 96, L: 4497384, color: "#2e681e" },
      { N: "地中海", C: 85, L: 2385715, color: "#446014" },
      { N: "日本", C: 85, L: 2400877, color: "#857c2f" },
      { N: "波斯湾", C: 71, L: 2346692, color: "#703c15" },
      { N: "非洲", C: 50, L: 1353716, color: "#33458d" },
      { N: "澳大利亚", C: 29, L: 1130280, color: "#852e39" },
      { N: "韩国", C: 8, L: 871062, color: "#864972" },
      { N: "中国台湾", C: 10, L: 637461, color: "#835d1c" },
      { N: "中国香港", C: 6, L: 22080, color: "#053d4c" },
      { N: "其他", C: 3, L: 437597, color: "#847c30" }
    );
    console.log(this.lines);
  }

  change(value) {
    this.props.onchange(value);
    this.init = false;
  }

  numFormat(num) {
    let str = "";
    while (num > 1000) {
      let s = num % 1000;
      s = parseInt(s);
      num /= 1000;
      num = parseInt(num);
      str = str ? s + "," + str : s;
    }
    str = num + "," + str;
    return str;
  }

  render() {
    return (
      <div className={style.line_pick}>
        {this.lines.map((e, i) => {
          return (
            <div
              className={`${style.line_picker}`}
              key={i}
              onClick={() => this.change(e.C)}
              key={i}
              value={e}
              style={{ background: e.color }}
              checked={this.init ? i == this.lines.length - 1 : null}
            >
              <div className={style.line_name}>{`${e.N}`}</div>
              <div className={style.line_count}>{`${e.C}`}</div>
              {/* <div className={style.line_carry}>{`${this.numFormat(e.L)}`}</div> */}
            </div>
          );
        })}
      </div>
    );
  }
}
