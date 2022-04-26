import SteamID from 'steamid'

export const createApiRoute = (path: string, version = 1) =>
  `/api/v${version}${!path.startsWith('/') ? '/' + path : path}`

export const parseSteamProfileURL = (value: string) => {
  const valueMatch = value.match(
    /(?:https?:\/\/)?steamcommunity\.com\/((?:profiles|id)\/[a-zA-Z0-9]+)/
  )
  const valueParsed = Array.isArray(valueMatch) ? valueMatch[1] : value

  if (
    valueParsed.startsWith('STEAM_') ||
    valueParsed.startsWith('765') ||
    valueParsed.startsWith('[U:')
  ) {
    const steamID = new SteamID(valueParsed)

    return steamID.isValid() ? `profiles/${steamID.toString()}` : null
  } else {
    return !valueParsed.startsWith('id/') &&
      !valueParsed.startsWith('profiles/')
      ? `id/${valueParsed}`
      : valueParsed
  }
}
