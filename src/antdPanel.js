import { Table, Carousel, Tag } from "antd";
import React, { Component } from "react";
import styles from "./antdPanel.css";

const { CheckableTag } = Tag;
export default class APanel extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.areaInfo;
    this.comps = {};
    let compsChecked = {};
    this.areaMap = {};
    this.allrow = [];
    for (let key in this.data) {
      let rows = this.data[key];
      rows = rows.map((e, i) => {
        return { ...e, key: i + Math.random() };
      });
      this.areaMap[key] = rows;
      this.allrow.push(...rows);
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
    let picked = this.props.pickInfo;
    let key = picked.pickArea;
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

    pages.push(
      <div className={styles.linePanel} key={key}>
        <div className={styles.areaTitle}>
          <span>{key}</span>
          <br />
          <span>-</span>
          <br />
          <span>{key === "All" ? "全部" : this.areaMap[key][0].areaN}</span>
        </div>
        {/* <hr /> */}
        <Table
          id={styles.Table}
          onRowClick={r => {
            this.props.onpickline(r.lineC);
          }}
          scroll={{ y: 240, x: 600 }}
          pagination={false}
          showHeader={false}
          size="small"
          // dataSource={key === "All" ? this.allrow : this.areaMap[key]}
          dataSource={this.props.pickedSealines}
          columns={columns}
        />
      </div>
    );
    for (let k in this.comps) {
      compTags.push(
        <CheckableTag
          checked={this.state.compsCheck[k]}
          onChange={checked => this.onCheck(k, checked)}
          key={k}
        >{`${k} - ${this.comps[k]}`}</CheckableTag>
      );
    }
    return (
      <div className={styles.rightPanel}>
        {pages}
        {/* <Carousel dotPosition="left">{pages}</Carousel> */}
        <div className={styles.tagPanel}>
          <div className={styles.tagIcon}>
            <span>船公司</span>
          </div>
          {compTags}
        </div>
      </div>
    );
  }
}
