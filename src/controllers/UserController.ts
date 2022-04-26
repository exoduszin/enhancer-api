import { load } from 'cheerio'
import { Request, Response } from 'express'
import SteamID from 'steamid'
import XML2JS from 'xml2js'

import { parseSteamProfileURL } from '../utils'
import { SteamHTTP } from '../utils/Constants'
import { EPrivacyState } from '../utils/Enums'
import Fetcher from '../utils/Fetcher'

const show = async (request: Request, response: Response) => {
  const { user } = request.query

  try {
    const userProfile = await Fetcher(
      `${SteamHTTP.COMMUNITY}/${parseSteamProfileURL(user)}`
    ).then((body) => {
      const $ = load(body)
      const lastBanDays = $('.profile_ban_status')
        .text()
        .match(/(\d+) day\(s\)/)

      return {
        private: !!$('.profile_private_info').text().trim(),
        level: +$('.friendPlayerLevelNum').first().text() || null,
        last_ban_days: lastBanDays ? +lastBanDays[1] : null
      }
    })
    const userData = await Fetcher(
      `${SteamHTTP.COMMUNITY}/${parseSteamProfileURL(user)}`,
      {
        query: { xml: 1 }
      }
    )
      .then((body) =>
        XML2JS.parseStringPromise(body, {
          explicitArray: false,
          trim: true
        })
      )
      .then(({ profile }) => {
        if (!profile) {
          throw new Error('The specified profile could not be found')
        }

        const steamID = new SteamID(profile.steamID64)

        return {
          steam_3id: steamID.getSteam3RenderedID(),
          steam_id32: steamID.getSteam2RenderedID(),
          steam_id64: steamID.getSteamID64(),
          custom_url: profile.customURL || null,
          name: profile.steamID,
          realname: profile.realname || null,
          avatar_url: {
            small: profile.avatarIcon,
            medium: profile.avatarMedium,
            full: profile.avatarFull
          },
          level: userProfile.level,
          location: profile.location || null,
          status: profile.stateMessage.replace(/<br\/>.*/, ''),
          privacy: EPrivacyState[profile.privacyState],
          limitations: {
            vac: !!+profile.vacBanned,
            trade_ban: profile.tradeBanState !== 'None',
            limited: !!+profile.isLimitedAccount,
            community_ban: !userProfile.private && !userProfile.level
          },
          last_ban_days: userProfile.last_ban_days,
          member_since: profile.memberSince || null
        }
      })

    response.status(200).json(userData)
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
}

export default { show }
