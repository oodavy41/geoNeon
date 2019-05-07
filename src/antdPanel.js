import { Table, Carousel, Tag } from "antd";
import React, { Component } from "react";
import "antd/dist/antd.css";
import "./antdPanel.css";

export default class APanel extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.areaInfo;
    this.comps = [];
  }

  //{points:[],lineC:"",lineN:"",compC:"",compN:"",areaC:"",areaN:""}
  render() {
    let pages = [];
    let companys = {};
    let compTags = [];
    let columns = [
      {
        title: "航线代码",
        dataIndex: "lineC",
        key: "lineC"
      },
      {
        title: "航线名称",
        dataIndex: "lineN",
        key: "lineN"
      },
      {
        title: "公司",
        dataIndex: "compN",
        key: "compN"
      },
      {
        title: "所属洲",
        dataIndex: "areaN",
        key: "areaN"
      },
      {
        title: "洲代码",
        dataIndex: "areaC",
        key: "areaC"
      }
    ];
    for (let key in this.data) {
      let rows = this.data[key];
      rows = rows.map((e, i) => {
        return { ...e, key: i };
      });
      rows.forEach(e => {
        if (!companys[e.compC]) {
          companys[e.compC] = e.compN;
        }
      });
      pages.push(
        <div key={key}>
          <div id="areaTitle">{key}</div>
          <hr />
          <Table pagination={false} showHeader={false} size="small" dataSource={rows} columns={columns} />
        </div>
      );
    }
    for (let k in companys) {
      compTags.push(<Tag key={k}>{`${k} - ${companys[k]}`}</Tag>);
    }
    return (
      <div id="rightPanel">
        <Carousel autoplay>{pages}</Carousel>
        <div id="tagPanel">{compTags}</div>
      </div>
    );
  }
}
