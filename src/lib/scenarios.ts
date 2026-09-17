import { SCENARIOS, type Scenario } from '../content.config'

export { SCENARIOS }
export type { Scenario }

export const SCENARIO_LABELS: Record<Scenario, string> = {
  'typhoon-season': 'Typhoon Season',
  'earthquake-ready': 'Earthquake Ready',
  'power-outage': 'Power Outage',
  'go-bag': 'Go-Bag',
  'off-grid': 'Off Grid',
  'first-aid': 'First Aid',
  edc: 'EDC',
}

export const SCENARIO_BLURBS: Record<Scenario, string> = {
  'typhoon-season': 'Kit that holds up when the rain comes sideways and the power goes.',
  'earthquake-ready': 'What to have within reach before the ground moves.',
  'power-outage': 'Light, charge and comfort for a brownout that overstays its welcome.',
  'go-bag': 'The one bag by the door, packed and ready to grab.',
  'off-grid': 'Water, power and light for the days the grid cannot reach you.',
  'first-aid': 'The kit and the know-how for the small emergencies and the serious ones.',
  edc: 'The few things worth carrying every single day.',
}

export function scenarioLabel(scenario: Scenario): string {
  return SCENARIO_LABELS[scenario]
}
