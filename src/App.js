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
    this.pickedSealine = sealineData;
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
    this.setState({
      pickLine: null,
      pickDay: 7,
      pickArea: "All"
    });
  }

  componentWillUpdate() {
    const flag = this.state;
    this.pickedSealine = this.sealineData.filter(eflag => {
      return (
        (eflag.areaC === flag.pickArea || flag.pickArea === "All") &&
        (eflag.day === flag.pickDay || flag.pickDay === 7) &&
        (flag.pickComps.find(v => v === eflag.compC) || flag.pickComps.length === 0)
      );
    });
    console.log(this.pickedSealine);
  }
  render() {
    return (
      <div style={{ width: "1920px", height: "1080px" }}>
        {/* <div className={style.title}>上海港全球航线</div> */}
        <WorldMap sealine={this.sealineData} areaMask={this.areas} pickState={this.state} offPick={() => this.offPickLine()} />
        {!this.state.pickLine ? (
          <div>
            <DayPicker onchange={v => this.onPickDay(v)} />
            <LinePicker areaInfo={this.areaHash} onchange={v => this.onPickArea(v)} />
            <APanel
              areaInfo={this.areaHash}
              pickInfo={this.state}
              onchange={v => this.onPickComp(v)}
              onpickline={v => this.onPickLine(v)}
              pickedSealines={this.pickedSealine}
            />
          </div>
        ) : (
          <InfoPanel lineInfo={this.state.pickLine} />
        )}
      </div>
    );
  }
}
