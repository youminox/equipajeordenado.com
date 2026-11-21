/**
 * Client-safe airline cabin-baggage dataset (used by AirlineChecker and the
 * /medidas-equipaje-de-mano/ table). Source of truth: data/airline-rules.json.
 * Each entry carries its official source URL and verification date.
 */
import airlineData from "../../data/airline-rules.json";

export interface AirlineRule {
  id: string;
  name: string;
  country: string;
  cabinSize: string;
  cabinWeight: string;
  personalItem: string;
  includedInBasicFare: string;
  notes: string;
  sourceUrl: string;
  verifiedAt: string;
  guideUrl: string;
}

type RawAirline = Omit<AirlineRule, "guideUrl"> & { guideUrl?: string };

export const AIRLINE_RULES: AirlineRule[] = (airlineData as RawAirline[]).map(
  (a) => ({
    ...a,
    guideUrl: a.guideUrl || `/medidas-equipaje-de-mano/#${a.id}`,
  })
);

/** Most recent verification date across the dataset (YYYY-MM-DD). */
export const AIRLINE_RULES_VERIFIED_AT = AIRLINE_RULES.reduce(
  (max, a) => (a.verifiedAt > max ? a.verifiedAt : max),
  ""
);
