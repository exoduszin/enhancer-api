import Fetch from 'isomorphic-fetch'

interface IFetcherOptions {
  query?: { [key: string]: unknown }
  options?: { [key: string]: unknown }
}

const buildQuery = (object) =>
  object
    ? Object.entries(object)
        .map((parameter) => parameter.join('='))
        .join('&')
    : ''

const parseResponse = (response) =>
  response.headers.get('Content-Type').startsWith('application/json')
    ? response.json()
    : response.text()

export default (
  url: string,
  { query, options }: IFetcherOptions = { query: {}, options: {} }
) =>
  Fetch(`${url}?${buildQuery(query)}`, options)
    .then((response) => (!response.ok ? Promise.reject(response) : response))
    .then((response) => parseResponse(response))
    .catch((response) => parseResponse(response))
