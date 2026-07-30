import { useMemo } from 'react'
import { checkEligibility } from '../utils/eligibility.js'

export function useEligibility(profile, jobs) {
  return useMemo(
    () => jobs.map((job) => ({ job, ...checkEligibility(profile, job) })),
    [profile, jobs]
  )
}
