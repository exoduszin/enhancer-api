# GET `/api/users`

- ?user=

```ts
{
  "steam_3id": string,
  "steam_id32": string,
  "steam_id64": string,
  "custom_url": string | null,
  "name": string,
  "realname": string | null,
  "avatar_url": {
    "small": string,
    "medium": string,
    "full": string
  },
  "level": number | null,
  "location": string | null,
  "status": string,
  "privacy": string,
  "limitations": {
    "vac": boolean,
    "trade_ban": boolean,
    "limited": boolean,
    "community_ban": boolean
  },
  "last_ban_days": number | null,
  "member_since": string | null,
  "groups": string[] | null
}
```

# GET `/api/groups`

- ?group=

```ts
{
  "steam_3id": string,
  "steam_id64": string,
  "custom_url": string,
  "name": string,
  "tag": string,
  "avatar_url": {
    "small": string,
    "medium": string,
    "full": string
  },
  "member_count": number,
  "members": string[]
}
```
