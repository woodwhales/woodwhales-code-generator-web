import axios from "axios";
import {Message, Loading} from 'element-ui';

let loading;

let root = getRoot();

function getRoot() {
  if (process.env.NODE_ENV === 'development') {
    return process.env.API_ROOT;
  } else {
    return '';
  }
}

const instance = axios.create({
  timeout: 864000,
  crossDomain: true,
  withCredentials: true
});

instance.defaults.withCredentials = true;
instance.defaults.crossDomain = true;
instance.defaults.headers.common['Access-Control-Allow-Origin'] = process.env.VUE_APP_Access_Control_Allow_Origin;

function startLoading() {
  loading = Loading.service({
    lock: true
  })
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) {
    return;
  } else {
    needLoadingRequestCount--;
  }
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

instance.interceptors
  .request
  .use(config => {
    config.url = root + config.url;
    showFullScreenLoading();
    return config
  }, error => {
    tryHideFullScreenLoading();
    Message.error({
      message: error
    });
    return Promise.reject(error);
  });

instance.interceptors
  .response
  .use(res => {
    tryHideFullScreenLoading();
    if (res.data.code === 0) {

    } else {
      Message.error({
        message: res.data.msg
      });
      return Promise.reject(res.data)
    }
    return res.data.data;
  }, error => {
    tryHideFullScreenLoading();
    Message.error({
      message: error
    });
    return Promise.reject(error)
  });



export default instance
