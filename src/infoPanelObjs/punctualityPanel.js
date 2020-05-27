import React, { Component } from "react";
import { Table, Progress, Tag } from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

import styles from "./punctualityPanel.css";

const def = [
  { year: 2020, month: 5, value: 1 },
  { year: 2020, month: 4, value: 1 },
  { year: 2020, month: 3, value: 0.3333333333333333 },
  { year: 2020, month: 2, value: 0 },
  { year: 2020, month: 1, value: 0 },
  { year: 2019, month: 12, value: 1 },
  { year: 2019, month: 11, value: 1 },
  { year: 2019, month: 5, value: 1 },
  { year: 2019, month: 4, value: 1 },
  { year: 2019, month: 3, value: 1 },
  { year: 2019, month: 2, value: 0 },
  { year: 2019, month: 1, value: 0.5 },
  { year: 2018, month: 12, value: 1 },
  { year: 2018, month: 11, value: 1 },
];
export default class Punctuality extends Component {
  constructor(props) {
    super(props);
    this.echartDiv = null;
    let data = this.props.data || def;
    this.rate = data[0].value * 100;
  }
  componentDidMount() {
    this.updateData();
  }
  componentDidUpdate() {
    this.updateData();
  }
  updateData() {
    let data = this.props.data || def;
    this.rate = data[0].value * 100;
    if (this.echartDiv) {
      this.myChart = echarts.init(this.echartDiv);
      this.myChart.setOption({
        tooltip: {},
        textStyle: {
          color: "rgb(161, 200, 230)",
        },
        title: {
          text: "历史准班率",
          textStyle: {
            color: "rgb(161, 200, 230)",
          },
          padding: 2,
        },
        legend: {
          show: true,
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          top: 50,
          bottom: 40,
        },
        xAxis: {
          type: "category",
          axisLine: { show: true, lineStyle: { color: "#fff" } },
          splitLine: { show: false },
        },
        yAxis: {
          axisLine: { show: false },
          splitLine: { lineStyle: { type: "dotted", color: "#999" } },
          type: "value",
          min: 0,
          max: 100,
        },
        series: [
          {
            type: "line",
            name: "当年准班率(%)",
            lineStyle: {
              color: "#57D785",
              width: 3,
            },
            data: data
              .slice(0, 7)
              .map((e) => [`${e.year}-${e.month}`, (e.value * 100).toFixed(2)]),
          },
          {
            type: "line",
            name: "历史同期准班率(%)",
            lineStyle: {
              color: "#448AFF",
              type: "dotted",
              width: 3,
            },
            data: data
              .slice(7)
              .map((e) => [`${e.year + 1}-${e.month}`, e.value * 100]),
          },
        ],
      });
    }
  }
  render() {
    return (
      <div className={styles.container}>
        当月准班率: <Progress
          style={{ width: 350, height: 50, color: "#fff" }}
          strokeColor={{
            from: "#108ee9",
            to: "#87d068",
          }}
          strokeWidth={15}
          percent={this.rate}
          status="active"
        />
        <div className={styles.echarts} ref={(e) => (this.echartDiv = e)} />
      </div>
    );
  }
}
