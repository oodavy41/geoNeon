import React, { Component } from "react";

import BoxNumPanel from "./boxNumPanel";
import Punctuality from "./punctualityPanel";

import style from "./panelContainer.css";

import boxNumIcon from "../sources/boxNum.png";
import punctualityIcon from "../sources/punctuality.png";
export default class PanelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: "boxNum"
    };
  }
  render() {
    return (
      <div className={style.main}>
        <div className={style.switcher}>
          <div className={style.switchBtn}>
            <div className={style.icon} style={{ backgroundImage: `url(${boxNumIcon})` }}></div>箱量
          </div>
          <div className={style.switchBtn}>
            <div
              className={style.icon}
              style={{
                backgroundImage: `url(${punctualityIcon})`
              }}
            ></div>
            准班率
          </div>
        </div>
        {this.state.showing === "boxNum" ? <BoxNumPanel></BoxNumPanel> : <Punctuality></Punctuality>}
      </div>
    );
  }
}
