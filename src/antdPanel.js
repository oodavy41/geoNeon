import { Table, Carousel, Tag } from "antd";
import React, { Component } from "react";
import styles from "./antdPanel.css";

const { CheckableTag } = Tag;
export default class APanel extends Component {
  constructor(props) {
    super(props);
    this.comps = this.props.cmpyInfo;
    let compsChecked = {};
    this.areaMap = {};
    this.state = {
      compsCheck: compsChecked,
      pickedLineData: null,
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
  //{points:[],lineC:"",lineN:"",cmpyC:"",cmpyN:"",areaC:"",areaN:""}
  render() {
    let picked = this.props.pickInfo;
    let key = picked.pickArea;
    let pages = [];
    if (this.props.pickedSealines.length > 0) {
      let columns1 = [
          {
            title: "航线代码",
            dataIndex: "lineC",
            key: "lineC",
          },
          {
            title: "航线名称",
            dataIndex: "lineN",
            key: "lineN",
          },
          {
            title: "所属洲",
            dataIndex: "areaN",
            key: "areaN",
          },
          {
            title: "洲代码",
            dataIndex: "areaC",
            key: "areaC",
          },
        ],
        columns2 = [
          {
            title: "公司名称",
            dataIndex: "cmpyN",
            key: "cmpyN",
          },
          {
            title: "公司代号",
            dataIndex: "cmpyC",
            key: "cmpyC",
          },
        ],
        sortLineData = this.props.pickedSealines.sort((a, b) =>
          a.lineC > b.lineC ? 1 : -1
        );
      let pickedLineData = this.state.pickedLineData || sortLineData[0];
      console.log(this.props.pickedSealines, pickedLineData);
      pages.push(
        <div className={styles.linePanel} key={key}>
          <div className={styles.areaTitle}>
            <span>{key}</span>
            <br />
            <span>-</span>
            <br />
            <span>{key === "ALL" ? "全部" : this.props.areaInfo[key]}</span>
          </div>
          {/* <hr /> */}
          <Table
            id={styles.Table}
            onRowClick={(r) => {
              this.setState({ pickedLineData: r });
            }}
            rowKey={(r) => r.lineC}
            scroll={{ y: 240, x: 600 }}
            pagination={false}
            showHeader={false}
            size="small"
            // dataSource={key === "All" ? this.allrow : this.areaMap[key]}
            dataSource={sortLineData}
            columns={columns1}
          />
          <div className={`${styles.areaTitle} ${styles.lineTitle}`}>
            <span>{pickedLineData && pickedLineData.lineC}</span>
          </div>
          <Table
            id={styles.SubTable}
            onRowClick={(r) => {
              this.props.onpickline(r.id);
            }}
            rowKey={(r) => r.id}
            scroll={{ y: 240, x: 600 }}
            pagination={false}
            showHeader={false}
            size="small"
            // dataSource={key === "All" ? this.allrow : this.areaMap[key]}
            dataSource={pickedLineData.infos}
            columns={columns2}
          />
        </div>
      );
    }
    let compTags = [];
    for (let k in this.comps) {
      compTags.push(
        <CheckableTag
          checked={this.state.compsCheck[k]}
          onChange={(checked) => this.onCheck(k, checked)}
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
          <div className={styles.tagContainer}>{compTags}</div>
        </div>
      </div>
    );
  }
}
