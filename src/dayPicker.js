import React, { Component } from "react";
import styles from "./sources/dayPicker.css";
export default class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.init = true;
    this.days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "All"];
  }

  onPick(i) {
    this.props.onchange(i);
    this.init = false;
  }

  render() {
    return (
      <div className={styles.day_pick}>
        {this.days.map((e, i) => (
          <div className={styles.picker} key={i}>
            <input
              type="radio"
              name="day"
              key={i}
              value={i}
              onClick={() => this.onPick(i)}
              checked={this.init ? i == this.days.length - 1 : null}
            />
            <span>{e}</span>
          </div>
        ))}
      </div>
    );
  }
}
