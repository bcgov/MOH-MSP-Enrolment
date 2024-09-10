import {
  isBefore,
  isValid as isDateValid,
  parseISO,
} from 'date-fns';

export const BLUE = '#036';
export const YELLOW = '#f3cd65';
export const GREEN = '#486446';

export const formatCurrencyNumber = (value) => {
  if (typeof value !== 'number') {
    return '$0';
  }
  const formatterOptions = {
    style: 'currency',
    currency: 'USD',
  };
  const formatter = new Intl.NumberFormat('en-US', formatterOptions);
  return formatter.format(value).replace('.00', '');
};

export const getCoverageTier = (options) => {
  const {
    ahBirthdate,
    spouseBirthdate,
    adjustedIncome,
    pre1939DeductibleTiers,
    deductibleTiers,
  } = options;
  if ((
      (isDateValid(ahBirthdate) && isBefore(ahBirthdate, parseISO('1940-01-01'))) ||
      (isDateValid(spouseBirthdate) && isBefore(spouseBirthdate, parseISO('1940-01-01')))
    )
    && Array.isArray(pre1939DeductibleTiers)
    && pre1939DeductibleTiers.length > 0) {
    let maxCoverageTier = pre1939DeductibleTiers[0];
    pre1939DeductibleTiers.forEach((item) => {
      if (parseFloat(item.endRange) > parseFloat(maxCoverageTier.endRange)) {
        maxCoverageTier = item;
      }
    });
    const coverageTier = pre1939DeductibleTiers.find((item) => {
      return adjustedIncome >= item.startRange && adjustedIncome <= item.endRange;
    });
    return coverageTier ? coverageTier : maxCoverageTier;
  } else if (Array.isArray(deductibleTiers)
    && deductibleTiers.length > 0) {
    let maxCoverageTier = deductibleTiers[0];
    deductibleTiers.forEach((item) => {
      if (parseFloat(item.endRange) > parseFloat(maxCoverageTier.endRange)) {
        maxCoverageTier = item;
      }
    });
    const coverageTier = deductibleTiers.find((item) => {
      return adjustedIncome >= item.startRange && adjustedIncome <= item.endRange;
    });
    return coverageTier ? coverageTier : maxCoverageTier;
  } else {
    return null;
  }
};

export const getDistributionBarItems = (tier) => {
  if (!tier) {
    return [];
  }
  if (tier.maximum === 0) {
    return [
      {
        color: GREEN,
        barLabel: '&infin;',
        label: 'PharmaCare pays 100% of eligible drug costs'
      }
    ];
  } else if (tier.deductible === 0) {
    return [
      {
        color: YELLOW,
        barLabel: formatCurrencyNumber(tier.maximum),
        label: `PharmaCare pays ${tier.pharmaCarePortion}% and you pay ${100 - tier.pharmaCarePortion}% of eligible drug costs (between ${formatCurrencyNumber(tier.deductible)} and ${formatCurrencyNumber(tier.maximum)})`
      },
      {
        color: GREEN,
        barLabel: '&infin;',
        label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${formatCurrencyNumber(tier.maximum)})`
      }
    ];
  } else if (tier.pharmaCarePortion === 100) {
    return [
      {
        color: BLUE,
        barLabel: formatCurrencyNumber(tier.deductible),
        label: `You pay 100% of eligible drug costs (between $0 and ${formatCurrencyNumber(tier.deductible)})`
      },
      {
        color: GREEN,
        barLabel: '&infin;',
        label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${formatCurrencyNumber(tier.maximum)})`
      },
    ];
  } else {
    return [
      {
        color: BLUE,
        barLabel: formatCurrencyNumber(tier.deductible),
        label: `You pay 100% of eligible drug costs (between $0 and ${formatCurrencyNumber(tier.deductible)})`
      },
      {
        color: YELLOW,
        barLabel: formatCurrencyNumber(tier.maximum),
        label: `PharmaCare pays ${tier.pharmaCarePortion}% and you pay ${100 - tier.pharmaCarePortion}% of eligible drug costs (between ${formatCurrencyNumber(tier.deductible)} and ${formatCurrencyNumber(tier.maximum)})`
      },
      {
        color: GREEN,
        barLabel: '&infin;',
        label: `PharmaCare pays 100% of eligible drug costs after you reach the family maximum (${formatCurrencyNumber(tier.maximum)})`
      },
    ];
  }
};

export const formatServerData = (arr) => {
  return arr.map((item) => {
    return {
      startRange: Number(item.startRange),
      endRange: Number(item.endRange),
      deductible: Number(item.deductible.replace('$', '')),
      pharmaCarePortion: Number(item.pharmaCarePortion.replace('%', '')),
      maximum: Number(item.maximum.replace('$', ''))
    };
  });
};
