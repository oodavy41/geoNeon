import React, { Component } from "react";
import WorldMap from "./worldMap";
import DayPicker from "./dayPicker";
import LinePicker from "./linePicker";
import sealineData from "./sources/data.json";
import APanel from "./antdPanel";

import style from "./style.css";

import "antd/dist/antd.css";
import InfoPanel from "./infoPanel";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickDay: 7, //0-7
      pickArea: "All", //area code
      pickComps: [], //picked company codes
      pickLine: null
    };
    this.areas = {};
    this.areaHash = {};
    this.sealineData = sealineData.map(e => {
      if (!this.areas[e.areaC]) {
        this.areas[e.areaC] = Object.keys(this.areas).length + 1;
      }

      if (!this.areaHash[e.areaC]) {
        this.areaHash[e.areaC] = [];
      }
      this.areaHash[e.areaC].push(e);
      return e;
    });
  }

  onPickArea(area) {
    this.setState({ pickArea: area });
  }

  onPickDay(day) {
    this.setState({ pickDay: day });
  }

  onPickComp(comps) {
    this.setState({ pickComps: comps });
  }

  onPickLine(lineCode) {
    let line = this.sealineData.find(v => lineCode === v.lineC);
    this.setState({ pickLine: line });
  }

  offPickLine() {
    this.setState({ pickLine: null });
  }

  render() {
    return (
      <div>
        <WorldMap sealine={this.sealineData} areaMask={this.areas} pickState={this.state} offPick={() => this.offPickLine()} />
        
      </div>
    );
  }
}
