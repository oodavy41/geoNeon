import { Table, Progress, Tag } from "antd";
import React, { Component } from "react";
import { get, post } from "./request/http";
import EchartPanel from "./infoPanelObjs/panelContainer";

import styles from "./infoPanel.css";

import infoBG from "./sources/sealineInfoBG.png";
import upIcon from "./sources/up.png";
import downIcon from "./sources/down.png";
const URL = `${
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://10.131.131.62:9080"
}/visdata/rest/pagemanage/dataset/HX/dataresult`;
const DEFAULTDATA = {
  boxnum: [{ year: 2020, month: 5, value: "911" }],
  ontime: [{ year: 2020, month: 5, value: 1 }],
};
function dataSplit(raw, rate) {
  let hash = {};
  raw = raw.map((v) => ({ year: +v.year, month: +v.month, value: +v.value }));
  raw.sort((a, b) => {
    return b.year + b.month / 100 - a.year - a.month / 100;
  });
  raw.forEach((e) => {
    hash[`${e.year}-${e.month}`] = e.value;
  });
  let y = {},
    ya = [],
    ma = [],
    nowyear = 0,
    nowmonth = 0;
  raw.forEach((e, i) => {
    if (i === 0) {
      nowyear = e.year;
      nowmonth = e.month;
    }
    if (!y[e.year]) {
      y[e.year] = { year: e.year, value: 0 };
    }
    y[e.year].value += e.value;
  });

  if (rate) {
    raw.forEach((e, i) => {
      if (e.year > nowyear - 2 && e.month > nowmonth - 5) {
        if (e.value === 0) e.value = 0.3;
        ma.push(e);
      }
    });
  } else {
    for (let i = 0; i < 7; i++) {
      ya.push({
        year: nowyear - i,
        value: 12000 + Math.random() * 60000,
      });
    }
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 5; i++) {
        ma.push({
          year: nowyear - j,
          month: nowmonth - i,
          value: 1000 + Math.random() * 5000,
        });
      }
    }
    ma.forEach((e) => {
      e.value = hash[`${e.year}-${e.month}`]
        ? hash[`${e.year}-${e.month}`]
        : e.value;
      e.value = e.value.toFixed(0);
    });
    ya.forEach((e) => {
      e.value = y[e.year] && y[e.year] > 12000 ? y[e.year].value : e.value;
      e.value = e.value.toFixed(0);
    });
    ya.sort((a, b) => {
      return a.year - b.year;
    });
    ma.sort((a, b) => {
      return a.year + a.month / 100 - b.year - b.month / 100;
    });
  }
  ya = ya.slice(0, 7);
  console.log("intput", raw);
  console.log("year", ya);
  console.log("month", ma);
  return { year: ya, month: ma };
}

export default class infoPanel extends Component {
  constructor(props) {
    super(props);
    this.id = 0;
    this.state = {
      ...DEFAULTDATA,
    };
  }

  componentDidMount() {
    this.getData(this.props.lineId);
  }

  componentDidUpdate() {
    this.getData(this.props.lineId);
  }

  getData(id) {
    if (this.id === id) return;
    post(URL, [
      { name: "sln_sid", value: id },
      { name: "type", value: "month" },
    ]).then((result) => {
      let { dataResult } = result.data.result;
      dataResult = JSON.parse(dataResult);
      dataResult = dataResult.slice(1);
      console.log("getdata", dataResult);
      let boxnum = [],
        ontime = [];
      dataResult.forEach((e) => {
        boxnum.push({ year: +e[2], month: +e[3], value: +e[4] });
        boxnum.push({
          year: e[2] - 1,
          month: +e[3],
          value: +e[5],
        });
        ontime.push({ year: +e[2], month: +e[3], value: +e[7] });
        ontime.push({
          year: e[2] - 1,
          month: +e[3],
          value: +e[9],
        });
      });
      console.log(boxnum, ontime);
      this.id = id;
      this.setState({ boxnum, ontime });
    });
  }
  render() {
    let { lineInfo: info, lineId: id } = this.props;
    console.log(info);
    if (info) {
      console.log(id, info.lineC);
      let idInfo = info.infos.find((e) => e.id === id);
      const { boxnum, ontime } = this.state;

      return (
        <div className={styles.lineInfoPanel}>
          <div
            className={styles.lineInfo}
            style={{ backgroundImage: `url(${infoBG})` }}
          >
            <div
              className={styles.lineInfoIcon}
              style={{ backgroundImage: `url(${upIcon})` }}
            ></div>
            {info.lineN}
            <br />
            <div
              className={styles.lineInfoIcon}
              style={{ backgroundImage: `url(${downIcon})` }}
            ></div>
            {idInfo.cmpyN + "-" + idInfo.cmpyC}
          </div>
          <EchartPanel
            data={{
              boxnum: dataSplit(boxnum),
              ontime: dataSplit(ontime, true),
            }}
          ></EchartPanel>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
