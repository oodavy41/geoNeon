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
      pickDay: 0,
      pickArea: 0,
      random: 0
    };
    this.areas = {};
    this.areaHash = {};
    this.sealineData = sealineData.map(e => {
      if (!this.areas[e.areaC]) {
        this.areas[e.areaC] = Object.keys(this.areas).length + 1;
      }
      let obj = { layerMask: this.areas[e.areaC], ...e };

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

  render() {
    return (
      <div>
        <WorldMap sealine={this.sealineData} areaMask={this.areas} pickArea={this.state.pickArea} />
        <DayPicker />
        <LinePicker areaInfo={this.areaHash} onchange={area => this.onPickArea(area)} />
        <APanel areaInfo={this.areaHash} />
      </div>
    );
  }
}
