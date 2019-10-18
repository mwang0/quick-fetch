export function queryString(url, query) {
  if (!query || Object.keys(query).length === 0) return url;

  let str = [];
  for (let key in query) {
    if (typeof query[key] === 'object') {
      query[key] = JSON.stringify(query[key]);
    }
    str.push(key + '=' + query[key]);
  }
  let paramStr = str.join('&');
  if (!paramStr) return url;

  return url.indexOf('?') != -1 ? `${url}&${paramStr}` : `${url}?${paramStr}`;
}

const absoluteURL = /^([a-z][a-z\d\+\-\.]*:)?\/\//i;
export function bulidFullUrl(baseUrl, url) {
  const hashmarkIndex = url.indexOf('#');
  if (hashmarkIndex !== -1) {
    url = url.slice(0, hashmarkIndex);
  }
  if (baseUrl && !absoluteURL.test(url)) {
    return baseUrl.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');
  }

  return url;
}
