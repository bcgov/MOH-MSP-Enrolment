export const isCorrespondenceAttachedAbleToSubmit = (correspondenceAttached) => {
  switch (correspondenceAttached) {
    case 'C':
      return false;
    case 'N':
      return true;
    case 'B':
      return false;
  }
  return true;
};
