import { Table, Progress, Tag } from "antd";
import React, { Component } from "react";

import EchartPanel from "./infoPanelObjs/panelContainer";

import styles from "./infoPanel.css";

import infoBG from "./sources/sealineInfoBG.png";
import upIcon from "./sources/up.png";
import downIcon from "./sources/down.png";
import lineNums from "./sources/linesCount.json";

const DEFAULTDATA = {
  boxnum: [{ year: "2020", month: "5", value: "911" }],
  ontime: [{ year: "2020", month: "5", value: 1 }],
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
    nowyear = new Date().getFullYear(),
    nowmonth = new Date().getMonth() + 1;
  raw.forEach((e, i) => {
    if (!y[e.year]) {
      y[e.year] = { year: e.year, value: 0 };
    }
    y[e.year].value += e.value;
  });

  if (rate) {
    raw.forEach((e, i) => {
      if (i === 0) {
        nowyear = e.year;
        nowmonth = e.month;
      }
      if (i < 7 || (i >= 12 && i < 19)) {
        ma.push(e);
      }
    });
    for (let k in y) {
      let p = y[k];
      if (p.year == nowyear) {
        p.value /= nowmonth;
      }
      ya.push(p);
    }
  } else {
    for (let i = 0; i < 7; i++) {
      ya.push({
        year: nowyear - i,
        value: 12000 + Math.random() * 60000,
      });
    }
    for (let j = 0; j < 2; j++) {
      for (let i = 1; i < 6; i++) {
        ma.push({
          year: nowyear - j,
          month: i,
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
  console.log(raw);
  console.log(ya);
  console.log(ma);
  return { year: ya, month: ma };
}

export default class infoPanel extends Component {
  render() {
    let { lineInfo: info, lineId: id } = this.props;
    console.log(info);
    if (info) {
      console.log(id, info.lineC);
      let idInfo = info.infos.find((e) => e.id === id);
      const { boxnum, ontime } = lineNums[id]||DEFAULTDATA;

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
