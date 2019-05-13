import React, { Component } from "react";
import WorldMap from "./worldMap";
import DayPicker from "./dayPicker";
import LinePicker from "./linePicker";
import sealineData from "./data.json";
import APanel from "./antdPanel";
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
      let obj = e;

      if (!this.areaHash[e.areaC]) {
        this.areaHash[e.areaC] = [];
      }
      this.areaHash[e.areaC].push(e);
      return obj;
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
    this.setState({ pickLine: lineCode });
  }

  render() {
    return (
      <div>
        <WorldMap sealine={this.sealineData} areaMask={this.areas} pickState={this.state} />
        <DayPicker onchange={v => this.onPickDay(v)} />
        <LinePicker areaInfo={this.areaHash} onchange={v => this.onPickArea(v)} />
        <APanel
          areaInfo={this.areaHash}
          pickInfo={this.state}
          onchange={v => this.onPickComp(v)}
          onpickline={v => this.onPickLine(v)}
        />
      </div>
    );
  }
}
