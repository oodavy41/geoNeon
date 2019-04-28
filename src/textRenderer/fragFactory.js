import * as THREE from "three";
import textFrag from "./fragment";
export default class FragFactory {
  constructor(font = undefined, color = undefined) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 2048;
    this.ctx = this.canvas.getContext("2d");
    this.defaultFont = font || 20;
    this.defaultColor = color || "#afafaf";
    this.modify = true;

    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.minFilter = THREE.NearestMipMapNearestFilter;
    this.frags = [];
  }

  frag(text, size = undefined, color = undefined) {
    let frag = new textFrag(this, this.frags.length, text, size || this.defaultFont, color || this.defaultColor);
    this.frags.push(frag);
    this.redraw();
    return frag;
  }

  redraw() {
    if (this.modify) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let yoffset = 0;
      this.ctx.textBaseline = "top";
      for (let i = 0; i < this.frags.length; i++) {
        let frag = this.frags[i];
        this.ctx.fillStyle = frag.color;
        this.ctx.font = frag.size + "px Fira Sans";
        let textWidth = this.ctx.measureText(frag.text);
        this.ctx.fillText(frag.text, 0, yoffset);
        frag.uvs = [
          0,
          1 - (yoffset + frag.size) / this.canvas.height,
          textWidth.width / this.canvas.width,
          1 - (yoffset + frag.size) / this.canvas.height,
          textWidth.width / this.canvas.width,
          1 - yoffset / this.canvas.height,
          0,
          1 - yoffset / this.canvas.height
        ];
        yoffset += frag.size;
        frag.height = frag.size;
        frag.width = textWidth.width;
        this.modify = false;
      }
    }
  }
}
