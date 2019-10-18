import defaults from './defaults';
import { queryString } from './utils';
import fetchHander from './handers/fetch';
import jsonHander from './handers/json';

const requestHanders = [];
const responseHandlers = [];

function request(opts) {
  if (typeof opts === 'string') {
  } else {
    opts = opts || {};
  }

  opts = { ...defaults, ...opts };

  const chain = [fetchHander, undefined, jsonHander, undefined];
  let promise = Promise.resolve(opts);

  requestHanders.forEach((hander) => {
    chain.unshift(hander.fulfilled, chain.rejected);
  });
  responseHandlers.forEach((hander) => {
    chain.unshift(hander.fulfilled, chain.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
}

function interceptor(isResponse = false, fulfilled, rejected) {
  const handlers = isResponse ? responseHandlers : requestHanders;
  handlers.push({
    fulfilled,
    rejected,
  });
  return handlers.length - 1;
}

const fetch = {
  defaults,
  requestUse(fulfilled, rejected) {
    return interceptor(false, fulfilled, rejected);
  },
  responseUse(fulfilled, rejected) {
    return interceptor(true, fulfilled, rejected);
  },
  get(url, params = {}, config = {}) {
    return request({ ...config, method: 'GET', url: queryString(url, params) });
  },
  post(url, data, config = {}) {
    return request({
      ...config,
      method: 'POST',
      data,
    });
  },
};

export default fetch;
