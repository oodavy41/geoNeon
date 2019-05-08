import { Table, Carousel, Tag } from "antd";
import React, { Component } from "react";
import "antd/dist/antd.css";
import "./antdPanel.css";

const { CheckableTag } = Tag;
export default class APanel extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.areaInfo;
    this.comps = {};
    let compsChecked = {};
    this.areaMap = {};
    for (let key in this.data) {
      let rows = this.data[key];
      rows = rows.map((e, i) => {
        return { ...e, key: i };
      });
      this.areaMap[key] = rows;
      rows.forEach(e => {
        if (!this.comps[e.compC]) {
          this.comps[e.compC] = e.compN;
          compsChecked[e.compC] = false;
        }
      });
    }
    this.state = {
      compsCheck: compsChecked
    };
  }

  onCheck(key, checked) {
    let _ = this.state.compsCheck;
    _[key] = checked;
    this.setState({ compsCheck: _ });
    let msg = [];
    for (let k in _) {
      if (_[k]) {
        msg.push(k);
      }
    }
    this.props.onchange(msg);
  }
  //{points:[],lineC:"",lineN:"",compC:"",compN:"",areaC:"",areaN:""}
  render() {
    let pages = [];
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
      pages.push(
        <div key={key}>
          <div id="areaTitle">{key}</div>
          {/* <hr /> */}
          <Table pagination={false} showHeader={false} size="small" dataSource={this.areaMap[key]} columns={columns} />
        </div>
      );
    }
    for (let k in this.comps) {
      compTags.push(
        <CheckableTag checked={this.state.compsCheck[k]} onChange={checked => this.onCheck(k, checked)} key={k}>{`${k} - ${
          this.comps[k]
        }`}</CheckableTag>
      );
    }
    return (
      <div id="rightPanel">
        <Carousel autoplay>{pages}</Carousel>
        <div id="tagPanel">{compTags}</div>
      </div>
    );
  }
}
