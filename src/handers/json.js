// string to json

const jsonReg = /^application\/json.*/i;
export default function(response) {
  let { code, headers, data } = response;
  if (
    code === 200 &&
    typeof data === 'string' &&
    jsonReg.test(headers['Content-Type'])
  ) {
    try {
      data = JSON.parse(data);
    } catch (err) {}
    response.data = data;
  }

  return response;
}
