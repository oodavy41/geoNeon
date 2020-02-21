import React, { Component } from "react";
import { Table, Progress, Tag } from "antd";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

import style from "./punctualityPanel.css";
export default class Punctuality extends Component {
  constructor(props) {
    super(props);
    this.echartDiv = null;
  }
  componentDidMount() {
    this.updateData();
  }
  componentDidUpdate() {
    this.updateData();
  }
  updateData() {
    if (this.echartDiv) {
      this.myChart = echarts.init(this.echartDiv);
      this.myChart.setOption({
        tooltip: {},
        textStyle: {
          color: "rgb(161, 200, 230)"
        },
        title: {
          text: "历史准点率",
          textStyle: {
            color: "rgb(161, 200, 230)"
          },
          padding: 2
        },
        legend: {
          show: true,
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          top: 50,
          bottom: 40
        },
        xAxis: {
          type: "time",
          axisLine: { show: true, lineStyle: { color: "#fff" } },
          splitLine: { show: false }
        },
        yAxis: {
          axisLine: { show: false },
          splitLine: { lineStyle: { type: "dotted", color: "#999" } },
          type: "value",
          min: "dataMin",
          max: "dataMax"
        },
        series: [
          {
            type: "line",
            name: "准班率(%)",
            lineStyle: {
              color: "#57D785",
              width: 3
            },
            data: [
              ["2018-2-20", 89],
              ["2018-2-27", 62],
              ["2018-3-06", 72],
              ["2018-3-13", 83],
              ["2018-3-20", 98],
              ["2018-3-27", 89],
              ["2018-4-03", 89]
            ]
          },
          {
            type: "line",
            name: "历史同期准班率(%)",
            lineStyle: {
              color: "#448AFF",
              type: "dotted",
              width: 3
            },
            data: [
              ["2018-2-20", 80],
              ["2018-2-27", 90],
              ["2018-3-06", 82],
              ["2018-3-13", 75],
              ["2018-3-20", 89],
              ["2018-3-27", 77],
              ["2018-4-03", 80]
            ]
          }
        ]
      });
    }
  }
  render() {
    let tagSource = [
      {
        key: "1",
        date: "2-27",
        tags: ["浓雾", "航道调整"]
      },
      {
        key: "2",
        date: "3-06",
        tags: ["浓雾"]
      }
    ];

    const columns = [
      {
        title: "日期",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "状况",
        dataIndex: "tags",
        key: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              return <Tag key={tag}>{tag}</Tag>;
            })}
          </span>
        )
      }
    ];
    return (
      <div>
        <Progress
          style={{ width: 350, height: 20 }}
          strokeColor={{
            from: "#108ee9",
            to: "#87d068"
          }}
          percent={89}
          status="active"
        />
        <div className={style.echarts} ref={e => (this.echartDiv = e)} />
        <Table dataSource={tagSource} columns={columns} pagination={false} showHeader={false} size="small" />
      </div>
    );
  }
}
