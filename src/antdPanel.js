import { Table, Carousel, Popover, Card } from "antd";
import React, { Component } from "react";
import { CanvasRenderer } from "three";

export default class APanel {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Carousel autoplay>
          <Card>
            <Table>aaa</Table>
          </Card>
        </Carousel>
        <Popover>aaa</Popover>
      </div>
    );
  }
}
