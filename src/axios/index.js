import axios from "axios";
import {Message, Loading} from 'element-ui';

let loading;

const instance = axios.create({
  timeout: 5000,
  crossDomain: true,
  withCredentials: true
});

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
      Message.success({
        message: res.data.msg,
        duration: 1000
      });
    } else {
      Message.error({
        message: res.data.msg
      });
    }
    return res.data.data;
  }, error => {
    tryHideFullScreenLoading();
    Message.error({
      message: error
    });
    return Promise.reject(error)
  });

instance.defaults.withCredentials = true;
instance.defaults.crossDomain = true;

export default instance
