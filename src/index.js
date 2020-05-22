import defaults from './defaults';
import fetchHandler from './handlers/fetch';
import jsonHandler from './handlers/json';

const requestHandlers = [];
const responseHandlers = [];

function request(opts) {
  if (typeof opts === 'string') {
  } else {
    opts = opts || {};
  }

  opts = { ...defaults, ...opts };

  const chain = [fetchHandler, undefined, jsonHandler, undefined];
  let promise = Promise.resolve(opts);

  requestHandlers.forEach((handler) => {
    chain.unshift(handler.fulfilled, handler.rejected);
  });
  responseHandlers.forEach((handler) => {
    chain.push(handler.fulfilled, handler.rejected);
  });
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
}

function interceptor(isResponse = false, fulfilled, rejected) {
  const handlers = isResponse ? responseHandlers : requestHandlers;
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
    return request({ ...config, method: 'GET', params, url });
  },
  post(url, data, config = {}) {
    return request({
      url,
      ...config,
      method: 'POST',
      data,
    });
  },
};

export default fetch;
