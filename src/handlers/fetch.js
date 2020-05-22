import fetch from '@system.fetch';
import prompt from '@system.prompt';
import { bulidFullUrl, queryString } from '../utils';

export default function request(opts) {
  let timer;
  const { data, method, url, responseType, baseUrl, params, header } = opts;
  let fullUrl = queryString(bulidFullUrl(baseUrl, url), params);
  const request = new Promise((resolve, reject) => {
    fetch.fetch({
      url: fullUrl,
      method,
      data,
      responseType,
      header,
      success(res) {
        res._reqOpts = opts;
        resolve(res);
      },
      fail(data, code) {
        reject({ data, code });
      },
      complete() {
        clearTimeout(timer);
      },
    });
  });

  // 超时处理
  const timeout = new Promise((res) => {
    timer = setTimeout(() => {
      prompt.showToast({
        message: '请求超时',
      });
      res({
        code: '100001',
        message: 'timeout',
      });
    }, 15000);
  });
  return Promise.race([request, timeout]);
}
