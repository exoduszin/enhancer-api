import { load } from 'cheerio'
import { Request, Response } from 'express'
import SteamID from 'steamid'
import XML2JS from 'xml2js'

import { parseSteamGroupURL } from '../utils'
import { SteamHTTP } from '../utils/Constants'
import Fetcher from '../utils/Fetcher'

const show = async (request: Request, response: Response) => {
  const { group } = request.query

  try {
    const groupProfile = await Fetcher(
      `${SteamHTTP.COMMUNITY}/${parseSteamGroupURL(group)}`
    ).then((body) => {
      const $ = load(body)

      if ($('#mainContents h2').text().toLowerCase().startsWith('error')) {
        throw new Error('The specified group could not be found')
      }

      return {
        tag: $('.grouppage_header_abbrev').first().text().trim()
      }
    })
    const groupData = await Fetcher(
      `${SteamHTTP.COMMUNITY}/${parseSteamGroupURL(group)}/memberslistxml`,
      { query: { xml: 1 } }
    )
      .then((body) =>
        XML2JS.parseStringPromise(body, {
          explicitArray: false,
          trim: true
        })
      )
      .then(({ memberList }) => {
        const groupID = new SteamID(memberList.groupID64)

        const details = memberList.groupDetails

        return {
          steam_3id: groupID.getSteam3RenderedID(),
          steam_id64: groupID.getSteamID64(),
          custom_url: details.groupURL,
          name: details.groupName,
          tag: groupProfile.tag,
          avatar_url: {
            small: details.avatarIcon,
            medium: details.avatarMedium,
            full: details.avatarFull
          },
          member_count: +memberList.memberCount,
          members: memberList.members.steamID64
        }
      })

    response.status(200).json(groupData)
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
}

export default { show }
