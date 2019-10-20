// lon 经度，西经为负数
// lat 纬度，南纬是负数
import "../settings";
export default function millerXY(lng, lat) {
  if (lng < global.Sets.Xoffset) lng += 360;
  var L = global.Sets.earthS, // 地球周长
    W = global.Sets.widthScale * L, // 平面展开后，x轴等于周长
    H = (global.Sets.heightScale * L) / 2, // y轴约等于周长一半
    mill = 2.3, // 米勒投影中的一个常数，范围大约在正负2.3之间
    x = (lng * Math.PI) / 180, // 将经度从度数转换为弧度
    y = -(lat * Math.PI) / 180; // 将纬度从度数转换为弧度
  // 这里是米勒投影的转换
  y = 1.25 * Math.log(Math.tan(0.25 * Math.PI + 0.4 * y));
  // 这里将弧度转为实际距离
  x = W / 2 + (W / (2 * Math.PI)) * x;
  y = H / 2 - (H / (2 * mill)) * y;
  // 转换结果的单位是公里
  // 可以根据此结果，算出在某个尺寸的画布上，各个点的坐标
  return [x, y];
}
