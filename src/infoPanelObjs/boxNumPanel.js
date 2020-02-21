import React, { Component } from "react";
import { Table, Progress, Tag } from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

import style from "./boxNumPanel.css";
export default class Punctuality extends Component {
  constructor(props) {
    super(props);
    this.echartDiv = null;
    this.myChart = null;
    this.state = {
      monthly: true
    };
  }
  componentDidMount() {
    this.updateData();
  }
  componentDidUpdate() {
    this.updateData();
  }
  updateData() {
    const monthly = {
      legend: {
        textStyle: {
          color: "#11CEFF"
        },
        data: ["2020年", "2019年"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "2%",
        containLabel: true
      },
      xAxis: {
        show: false,
        type: "value",
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          color: "#11CEFF"
        },
        type: "category",
        data: ["1月", "2月", "3月", "4月"]
      },
      series: [
        {
          name: "2020年",
          type: "bar",
          data: [2115, 1901, 1823, 2263],
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
                  color: "rgba(43,67,131,0.47)"
                },
                {
                  offset: 1,
                  color: "#20C1E3"
                }
              ],
              global: false // 缺省为 false
            }
          },
          label: {
            show: true,
            position: "insideRight",
            textStyle: {
              color: "#181E41"
            }
          }
        },
        {
          name: "2019年",
          type: "bar",
          data: [1992, 2243, 2008, 2143],
          itemStyle: { color: "#309454" },
          label: {
            show: true,
            position: "insideRight",
            textStyle: {
              color: "#e5e5e5"
            }
          }
        }
      ]
    };
    const yearly = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "2%",
        containLabel: true
      },
      xAxis: {
        show: false,
        type: "value",
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          color: "#11CEFF"
        },
        type: "category",
        data: [2020, 2019, 2018, 2017, 2016, 2015, 2014]
      },
      series: [
        {
          type: "bar",
          data: [1115, 5901, 5823, 6865, 5978, 6010, 7099],
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
                  color: "rgba(43,67,131,0.47)"
                },
                {
                  offset: 1,
                  color: "#20C1E3"
                }
              ],
              global: false // 缺省为 false
            }
          },
          label: {
            show: true,
            position: "insideRight",
            textStyle: {
              color: "#e5e5e5"
            }
          }
        }
      ]
    };
    if (this.echartDiv && !this.myChart) {
      this.myChart = echarts.init(this.echartDiv);
    } else {
      this.myChart.clear();
    }
    this.myChart.setOption(this.state.monthly ? monthly : yearly);
  }
  render() {
    return (
      <div>
        <div className={style.switcher}>
          <div
            className={`${style.switchBtn} ${this.state.monthly ? style.pickedBtn : ""}`}
            onClick={() => {
              this.setState({ monthly: true });
            }}
          >
            月度
          </div>
          <div
            className={`${style.switchBtn} ${this.state.monthly ? "" : style.pickedBtn}`}
            onClick={() => {
              this.setState({ monthly: false });
            }}
          >
            年度
          </div>
        </div>
        <div className={style.echarts} ref={e => (this.echartDiv = e)} />
      </div>
    );
  }
}
