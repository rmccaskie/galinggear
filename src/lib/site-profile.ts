// ---------------------------------------------------------------------------
// Site profile loader (website / build-time)
// ---------------------------------------------------------------------------
// The website reads the profile as a build-time JSON import, validated by the
// shared schema. If the profile is missing or invalid the build fails loudly
// with a readable message (the throw below runs at module load).
//
// The admin/pipeline/cron read the SAME JSON through GitHub with caching
// (see admin `lib/site-profile.ts`). This file is the website's counterpart.
// ---------------------------------------------------------------------------
import profileData from '../data/site-profile.json'
import { siteProfileSchema, type SiteProfile } from './site-profile-schema'

let cached: SiteProfile | null = null

export function getSiteProfile(): SiteProfile {
  if (cached) return cached
  const result = siteProfileSchema.safeParse(profileData)
  if (!result.success) {
    throw new Error(
      `Invalid site profile (src/data/site-profile.json):\n${result.error.toString()}`
    )
  }
  cached = result.data
  return cached
}

/** Eagerly validated singleton — importing this fails the build if invalid. */
export const siteProfile: SiteProfile = getSiteProfile()
