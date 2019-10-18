import fetch from '@system.fetch';
import prompt from '@system.prompt';
import { bulidFullUrl } from '../utils';

export default function request(opts) {
  let timer;
  opts.url = bulidFullUrl(opts.baseUrl, opts.url);
  const { data, method, url, responseType } = opts;
  const request = new Promise((resolve, reject) => {
    fetch.fetch({
      url,
      method,
      data,
      responseType,
      success(res) {
        resolve(res);
      },
      fail(data, code) {
        reject(data, code);
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
