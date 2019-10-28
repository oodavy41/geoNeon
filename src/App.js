import React, { Component } from "react";
import WorldMap from "./worldMap";
import DayPicker from "./dayPicker";
import LinePicker from "./linePicker";
import sealineData from "./sources/data.json";
import APanel from "./antdPanel";

import InfoPanel from "./infoPanel";

import style from "./style.css";
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
        this.areas[e.areaC] = e.areaN;
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
    let dic = {
      北美: 85,
      西北欧: 67,
      南美: 55,
      东南亚: 1,
      地中海: 43,
      日本: 1,
      波斯湾: 35,
      非洲: 15,
      澳洲: 1,
      台湾: 1,
      香港: 1,
      韩国: 1,
      其他: 3
    };
    let round = 5;
    sealineData.forEach(element => {
      let times = Math.pow(dic[element.areaN], 0.2) || 0;
      for (let i = 0; i < times; i++) {
        let data = element.points;
        let newData = data.map(e => {
          return [e[0] + (Math.random() - 0.5) * round, e[1] + (Math.random() - 0.5) * round];
        });
        this.sealineData.push({ ...element, points: newData });
      }
    });
    return (
      <div>
        <div className={style.title}>上海港全球航线</div>
        <div className={style.subtitle}>航线总数：854</div>
        {/* <div className={style.subsubtitle}>2018总箱量(TEU):42,010,000</div> */}
        <div className={style.shanghaiTag}>上海 ●</div>
        <WorldMap sealine={this.sealineData} pickState={this.state} offPick={() => this.offPickLine()} />
        {!this.state.pickLine ? (
          <div>
            {/* <DayPicker onchange={v => this.onPickDay(v)} /> */}
            <LinePicker areaInfo={this.areaHash} areas={this.areas} onchange={v => this.onPickArea(v)} />
            {/* <APanel
              areaInfo={this.areaHash}
              pickInfo={this.state}
              onchange={v => this.onPickComp(v)}
              onpickline={v => this.onPickLine(v)}
            /> */}
          </div>
        ) : (
          {
            /* <InfoPanel lineInfo={this.state.pickLine} />*/
          }
        )}
      </div>
    );
  }
}
