import * as fs from "fs";

//to help ensure local servers are online before running integration tests
export const tryServer = async (website, HTTPMethod) => {
  const retryAttempts = 10;

  for (let i = 0; i < retryAttempts; i++) {
    try {
      await fetch(website, {
        method: HTTPMethod,
      });
      // console.log(`successfully reached ${website}!`);
      return new Promise((resolve, reject) => {
        resolve();
      });
    } catch (error) {
      // console.log(`failed to reach ${website}, attempt `, i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  return new Promise((resolve, reject) => {
    reject(`Couldn't reach ${website} (tried ${retryAttempts} times and gave up)`);
  });
};

export const doesPathExist = async (path) => {
  try {
    fs.accessSync(path);
    // console.log(`${path} exists`);
    return true;
  } catch (err) {
    // console.log(`${path} does not exist (could not reach)`)
    return false;
  }
};
