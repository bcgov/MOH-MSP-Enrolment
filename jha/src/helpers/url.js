export const isCSR = (path) => {
  if (path) {
    return path.includes("-csr");
  }
  return false;
};

export const convertURLToCSR = (path) => {
  const splitPath = path.split("/");
  let newPath = "/";

  newPath += splitPath[1] + "-csr";

  if (splitPath.length > 2) {
    for (let i = 2; i < splitPath.length; i++) {
      newPath += "/" + splitPath[i];
    }
  }
  return newPath;
};

export const getConvertedPath = (currentPath, path) => {
  if (isCSR(currentPath)) {
    return convertURLToCSR(path);
  }
  return path;
};
