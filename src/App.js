import React, { Component } from "react";
import WorldMap from "./worldMap";
import DayPicker from "./dayPicker";
import LinePicker from "./linePicker";
import sealineData from "./sources/fullLinesInfo.json";
import APanel from "./antdPanel";

import styles from "./style.css";

import "antd/dist/antd.css";
import InfoPanel from "./infoPanel";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pickDay: "W1", //0-7
      pickArea: "ALL", //area code
      pickComps: [], //picked company codes
      pickLine: null,
      pickId: 0,
      changed: true,
    };
    this.areas = {};
    this.cmpys = {};
    this.sealineData = sealineData.filter((e) => e.points.length > 0);
    this.sealineData.forEach((e) => {
      if (!this.areas[e.areaC]) {
        this.areas[e.areaC] = e.areaN;
      }
      e.infos.forEach((f) => {
        if (!this.cmpys[f.cmpyC]) {
          this.cmpys[f.cmpyC] = f.cmpyN;
        }
      });
    });
    console.log(
      "no Data Lines",
      JSON.stringify(
        sealineData.filter((e) => e.points.length === 0).map((e) => e.lineC)
      )
    );
    this.pickedSealine = [];
    this.filteSealine();
  }

  restore() {
    this.setState({
      pickDay: "W1", //0-7
      pickArea: "All", //area code
      pickComps: [], //picked company codes
      pickLine: null,
      pickId: 0,
    });
  }
  onPickArea(area) {
    this.setState({ pickArea: area, changed: true });
  }

  onPickDay(day) {
    this.setState({ pickDay: day, changed: true });
  }

  onPickComp(comps) {
    this.setState({ pickComps: comps, changed: true });
  }

  onPickLine(lineCode) {
    let line = this.sealineData.find((v) =>
      v.infos.find((e) => lineCode === e.id)
    );
    console.log("line pick", lineCode, line);
    this.setState({ pickLine: line, pickId: lineCode, changed: true });
  }

  offPickLine() {
    this.setState({
      pickLine: null,
    });
  }

  filteSealine() {
    if (this.state.changed) {
      const flag = this.state;
      this.pickedSealine = this.sealineData.filter((eflag) => {
        return (
          (eflag.areaC === flag.pickArea || flag.pickArea === "ALL") &&
          (eflag.infos.find((f) => f.day === flag.pickDay) ||
            flag.pickDay === "W8") &&
          (flag.pickComps.find((v) => eflag.infos.find((e) => e.cmpyC === v)) ||
            flag.pickComps.length === 0)
        );
      });
      console.log(this.pickedSealine);
      this.setState({ changed: false });
    }
    return this.pickedSealine;
  }
  render() {
    return (
      <div style={{ position: "relative", width: "1920px", height: "1080px" }}>
        {/* <div className={styles.title}>上海港全球航线</div> */}
        <WorldMap
          sealine={this.sealineData}
          pickedLine={this.filteSealine()}
          areaMask={this.areas}
          pickState={this.state}
          offPick={() => this.offPickLine()}
        />
        {!this.state.pickLine ? (
          <div>
            <DayPicker onchange={(v) => this.onPickDay(v)} />
            <LinePicker
              areaInfo={this.areas}
              onchange={(v) => this.onPickArea(v)}
            />
            <APanel
              areaInfo={this.areas}
              cmpyInfo={this.cmpys}
              pickInfo={this.state}
              onchange={(v) => this.onPickComp(v)}
              onpickline={(v) => this.onPickLine(v)}
              pickedSealines={this.filteSealine()}
            />
          </div>
        ) : (
          <InfoPanel
            lineInfo={this.state.pickLine}
            lineId={this.state.pickId}
          />
        )}
      </div>
    );
  }
}
