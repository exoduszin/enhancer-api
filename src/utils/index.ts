import SteamID from 'steamid'

export const createApiRoute = (path: string) =>
  `/api${!path.startsWith('/') ? '/' + path : path}`

export const parseSteamProfileURL = (value: string) => {
  const valueMatch = value.match(steamLinkRegex(['profiles', 'id']))
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

export const parseSteamGroupURL = (value: string) => {
  const valueMatch = value.match(steamLinkRegex(['gid', 'groups']))
  const valueParsed = Array.isArray(valueMatch) ? valueMatch[1] : value

  if (valueParsed.startsWith('103') || valueParsed.startsWith('[g:')) {
    const steamID = new SteamID(valueParsed)

    return `gid/${steamID.toString()}`
  } else {
    return !valueParsed.startsWith('gid/') && !valueParsed.startsWith('groups/')
      ? `groups/${valueParsed}`
      : valueParsed
  }
}

export const steamLinkRegex = (values: string[]) =>
  new RegExp(
    `(?:https?:\\/\\/)?steamcommunity\\.com\\/((?:${values.join(
      '|'
    )})\\/[a-zA-Z0-9_-]+)`
  )
