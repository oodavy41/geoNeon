import axios from "axios";
// import qs from "qs";

const serivce = axios.create({
  // baseURL: "",  // api的base_url 可写在process.env.BASE_URL中
  timeout: 50000, // 请求超时时间
});
let isRetryRequest = false;
let getTokenPromise = axios({
  url: `${
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://fakeip:9080"
  }/api`,
  method: "post",
  data: {
    username: "username",
    password: "password",
    captchaSwitch: false,
  },
  transformRequest: [
    function (data) {
      // Do whatever you want to transform the data
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
      }
      return ret;
    },
  ],
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

serivce.interceptors.request.use(
  // 请求拦截
  (config) => {
    let token = localStorage.getItem("token111");
    return new Promise((resolve) => {
      if (isRetryRequest === true) {
        getTokenPromise.then((d) => {
          console.log("token请求成功后开始执行挂起的请求", config);
          isRetryRequest = false;
          config.headers["token"] = d["data"]["result"]["access_token"];
          resolve(config);
        });
      } else {
        if (token == null) {
          console.log("没有token，先请求token");
          isRetryRequest = true;
          getTokenPromise
            .then((d) => {
              var token_HESHENG = d["data"]["result"]["access_token"];
              localStorage.setItem("token111", token_HESHENG);
              token = token_HESHENG;
              config.headers["token"] = token;
              resolve(config);
            })
            .catch((error) => {
              console.log("error!:" + error);
            });
        } else {
          console.log("有token直接设置");
          config.headers["token"] = token;
          resolve(config);
        }
      }
    });
    // console.log(config)
    // // let token = localStorage.getItem("token");
    // if(token){
    //   console.log("如果token存在 就设置")
    //   config.headers['token'] = token;
    // }else{
    //   console.log("token不存在 不请求token")
    // }
    // return config
  },
  (error) => {
    return Promise.reject(error);
  }
);
serivce.interceptors.response.use(
  // 回复拦截，主要针对部分回掉数据状态码进行处理
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response);
    if (error.response) {
      // console.log('上次接口错误config',error.response.config)
      if (error.response.status == 401 && isRetryRequest == true) {
        console.log("token错误,重新请求");
        let token = localStorage.getItem("token");
        let config = error.response.config;
        config.headers["token"] = token;
        console.log("重发请求！");
        return axios(config);
      } else {
        let getTokenPromise = axios({
          url: "http://bigdata.cn.gov:8080/visdata/rest/auth/login",
          method: "post",
          data: {
            username: "dituapi@dituapi.com",
            password: "dituapi",
            captchaSwitch: false,
          },
          transformRequest: [
            function (data) {
              // Do whatever you want to transform the data
              let ret = "";
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
              }
              return ret;
            },
          ],
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        return getTokenPromise.then((d) => {
          console.log(d);
          var token_HESHENG = d["data"]["result"]["access_token"];
          localStorage.setItem("token111", token_HESHENG);
          let config = error.response.config;
          config.headers["token"] = token_HESHENG;
          console.log("重新请求token重发请求！");
          return axios(config);
        });
      }
    } else {
      console.log("未知错误！");
      return Promise.reject(error);
    }
  }
);
export default serivce;
