import React, { Component } from "react";
import "./dayPicker.css";
export default class DayPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0
    };
    this.days = [ "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun","All",];
  }

  render() {
    return (
      <div id="day_pick">
        {this.days.map((e, i) => (
          <div className="picker" key={i}>
            <input type="radio" name="day" key={i} value={i} checked />
            <span>{e}</span>
          </div>
        ))}
      </div>
    );
  }
}
