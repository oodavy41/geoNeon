var fs = require("fs");
var HC = require("http");
var cityf = "cities.json";
var out = "citiesJSON.json";

var cityInfo = JSON.parse(fs.readFileSync(cityf));

var dic = {};

for (let i = 0; i < cityInfo.length; i++) {
  let name = cityInfo[i][2];
  dic[name] = cityInfo[i];
}
fs.writeFileSync(out, JSON.stringify(dic, 2));
