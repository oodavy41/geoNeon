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

  frag(parent, text, size = undefined, color = undefined) {
    let frag = new textFrag(this, this.frags.length, text, size || this.defaultFont, color || this.defaultColor);
    frag.layers = parent.layers;
    this.frags.push(frag);
    this.redraw();
    return frag;
  }

  redraw() {
    if (this.modify) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "rgba(30,30,30,0.5)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      let yoffset = 10;
      this.ctx.textBaseline = "top";
      for (let i = 0; i < this.frags.length; i++) {
        let frag = this.frags[i];
        this.ctx.fillStyle = frag.color;
        this.ctx.font = frag.size + "px Fira Sans";
        let text = " " + frag.text + " ";
        let textWidth = this.ctx.measureText(text);
        this.ctx.fillText(text, 0, yoffset);
        frag.uvs = [
          0,
          1 - (yoffset + frag.size - 4) / this.canvas.height,
          textWidth.width / this.canvas.width,
          1 - (yoffset + frag.size - 4) / this.canvas.height,
          textWidth.width / this.canvas.width,
          1 - (yoffset - 4) / this.canvas.height,
          0,
          1 - (yoffset - 4) / this.canvas.height
        ];
        yoffset += frag.size;
        frag.height = frag.size;
        frag.width = textWidth.width;
        this.modify = false;
      }
    }
  }
}
