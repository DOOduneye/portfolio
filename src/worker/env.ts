export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  MEDIA: R2Bucket

  ENVIRONMENT?: string
  CF_ACCESS_TEAM_DOMAIN?: string
  CF_ACCESS_AUD?: string

  SPOTIFY_CLIENT_ID?: string
  SPOTIFY_CLIENT_SECRET?: string
  SPOTIFY_REFRESH_TOKEN?: string
}
