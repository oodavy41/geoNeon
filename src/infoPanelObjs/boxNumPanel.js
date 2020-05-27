import React, { Component } from "react";
import { Table, Progress, Tag } from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

import styles from "./boxNumPanel.css";

const def = {
  year: [
    { year: 2014, value: 2089 },
    { year: 2015, value: 18172 },
    { year: 2016, value: 21274.75 },
    { year: 2017, value: 17464.5 },
    { year: 2018, value: 21883 },
    { year: 2019, value: 17126.5 },
    { year: 2020, value: 5496 },
  ],
  month: [
    { year: 2020, month: 5, value: 11276 },
    { year: 2020, month: 4, value: 12331.5 },
    { year: 2020, month: 3, value: 7759 },
    { year: 2020, month: 2, value: 7103 },
    { year: 2020, month: 1, value: 5103 },
    { year: 2019, month: 5, value: 13024.5 },
    { year: 2019, month: 4, value: 5023.75 },
    { year: 2019, month: 3, value: 10855 },
    { year: 2019, month: 2, value: 4027 },
    { year: 2019, month: 1, value: 6103 },
  ],
};

export default class Punctuality extends Component {
  constructor(props) {
    super(props);
    this.echartDiv = null;
    this.myChart = null;
    this.state = {
      monthly: true,
    };
  }
  componentDidMount() {
    this.updateData();
  }
  componentDidUpdate() {
    this.updateData();
  }
  updateData() {
    let data =this.props.data || def;
    if (this.state.monthly) {
      data = data.month;
      data = {
        legend: {
          show: true,
          textStyle: {
            color: "#11CEFF",
          },
          data: [`${data[0].year}年`, `${data[data.length - 1].year}年`],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "5%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#11CEFF",
          },
          type: "category",
          data: [
            `${data[0].month}月`,
            `${data[1].month}月`,
            `${data[2].month}月`,
            `${data[3].month}月`,
            `${data[4].month}月`,
          ],
        },
        series: [
          {
            name: `${data[0].year}年`,
            type: "bar",
            data: data.slice(0, 5).map((e) => e.value),
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(43,67,131,0.47)",
                  },
                  {
                    offset: 1,
                    color: "#20C1E3",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            label: {
              show: true,
              position: "insideRight",
              textStyle: {
                color: "#181E41",
              },
            },
          },
          {
            name: `${data[data.length - 1].year}年`,
            type: "bar",
            data: data.slice(5, 10).map((e) => e.value),
            itemStyle: { color: "#309454" },
            label: {
              show: true,
              position: "insideRight",
              textStyle: {
                color: "#e5e5e5",
              },
            },
          },
        ],
      };
    } else {
      data = data.year;
      data = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "2%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: "#11CEFF",
          },
          type: "category",
          data: data.map((v) => v.year),
        },
        series: [
          {
            type: "bar",
            data: data.map((v) => v.value),
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(43,67,131,0.47)",
                  },
                  {
                    offset: 1,
                    color: "#20C1E3",
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            label: {
              show: true,
              position: "insideRight",
              textStyle: {
                color: "#e5e5e5",
              },
            },
          },
        ],
      };
    }
    if (this.echartDiv && !this.myChart) {
      this.myChart = echarts.init(this.echartDiv);
    } else {
      this.myChart.clear();
    }
    this.myChart.setOption(data);
  }
  render() {
    return (
      <div className={styles.boxNumPanel}>
        <div className={styles.switcher}>
          <div
            className={`${styles.switchBtn} ${
              this.state.monthly ? styles.pickedBtn : ""
            }`}
            onClick={() => {
              this.setState({ monthly: true });
            }}
          >
            月度
          </div>
          <div
            className={`${styles.switchBtn} ${
              this.state.monthly ? "" : styles.pickedBtn
            }`}
            onClick={() => {
              this.setState({ monthly: false });
            }}
          >
            年度
          </div>
        </div>
        <div className={styles.echarts} ref={(e) => (this.echartDiv = e)} />
      </div>
    );
  }
}
