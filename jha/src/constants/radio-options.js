import { CanadianStatusReasons } from './immigration-status-types'

export const radioOptionsCitizenStatusReasons = [
  {
    id: 'not-new',
    label: CanadianStatusReasons.LivingInBCWithoutMSP,
    value: CanadianStatusReasons.LivingInBCWithoutMSP,
  },
  {
    id: 'new-to-province',
    label: CanadianStatusReasons.MovingFromProvince,
    value: CanadianStatusReasons.MovingFromProvince,
  },
  {
    id: 'new-to-country',
    label: CanadianStatusReasons.MovingFromCountry,
    value: CanadianStatusReasons.MovingFromCountry,
  }
]
