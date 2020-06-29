import * as THREE from "three";
import textFrag from "./fragment";
export default class FragFactory {
  constructor( maxAnisotropy,font = undefined, color = undefined) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 4096;
    this.canvas.height = 4096;
    this.yoffset = 3;
    this.xoffset = 0;
    this.lineHeight = 0;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(30,30,30,0.2)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.defaultFont = font || 40;
    this.defaultColor = color || "#afafaf";

    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.minFilter = THREE.LinearFilter;
    this.tex.anisotropy = maxAnisotropy;
    this.frags = {};
  }

  frag(parent, text, size = undefined, color = undefined) {
    let frag = this.frags[text];
    if (!frag) {
      frag = this.frags[text] = new textFrag(
        this,
        this.frags.length,
        text,
        size || this.defaultFont,
        color || this.defaultColor
      );
    }
    frag.sealineInfo = parent.sealineInfo;
    return frag;
  }

  draw(frag) {
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = frag.color;
    this.ctx.font = frag.size + "px Fira Sans";
    let text = " " + frag.text + " ";
    let textWidth = this.ctx.measureText(text);
    this.lineHeight = Math.max(this.lineHeight, frag.size);
    if (this.xoffset + textWidth.width > this.canvas.width) {
      this.yoffset += this.lineHeight + 3;
      this.xoffset = 0;
    }
    this.ctx.fillText(text, this.xoffset, this.yoffset);
    frag.uvs = [
      this.xoffset / this.canvas.width,
      1 - (this.yoffset + frag.size - 4) / this.canvas.height,
      (this.xoffset + textWidth.width) / this.canvas.width,
      1 - (this.yoffset + frag.size - 4) / this.canvas.height,
      (this.xoffset + textWidth.width) / this.canvas.width,
      1 - (this.yoffset - 4) / this.canvas.height,
      this.xoffset / this.canvas.width,
      1 - (this.yoffset - 4) / this.canvas.height,
    ];
    this.xoffset += textWidth.width + 3;
    frag.height = frag.size;
    frag.width = textWidth.width;
  }
}
