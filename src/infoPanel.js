import { Table, Progress, Tag } from 'antd';
import React, { Component } from 'react';

import EchartPanel from './infoPanelObjs/panelContainer';

import styles from './infoPanel.css';

import infoBG from './sources/sealineInfoBG.png';
import upIcon from './sources/up.png';
import downIcon from './sources/down.png';

export default class infoPanel extends Component {
  render() {
    let info = this.props.lineInfo;
    if (info) {
      return (
        <div className={styles.lineInfoPanel}>
          <div className={styles.lineInfo} style={{ backgroundImage: `url(${infoBG})` }}>
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
            {info.cmpyN + '-' + info.cmpyC}
          </div>
          <EchartPanel></EchartPanel>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
