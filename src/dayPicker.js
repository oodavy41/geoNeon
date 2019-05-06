import React, { Component } from "react";
import "./dayPicker.css";
export default class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0
    };
    this.days = ["All", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  }

  render() {
    return (
      <div id="day_pick">
        {this.days.map((e, i) => (
          <div class="picker">
            <input type="radio" name="day" key={i} value={i} checked />
            <span>{e}</span>
          </div>
        ))}
      </div>
    );
  }
}
