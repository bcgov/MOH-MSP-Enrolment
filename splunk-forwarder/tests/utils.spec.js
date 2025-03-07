// import * as utils from "../src/utils.js";

// describe("utils.formatTime()", () => {
//   it("returns null when passed a null value", () => {
//     expect(utils.formatTime()).toBeNull();
//   });
//   it("returns non-null value when passed the current time", () => {
//     expect(utils.formatTime(Date.now())).not.toBeNull();
//   });
//   it("returns specifically formatted timestamp when passed current time", () => {
//     const testTime = 1724710667670;
//     const testString = testTime.toString()
//     const result = utils.formatTime(testTime)
//     expect(result).toContain(".");
//     expect(result).toContain(testString.slice(1, 5));
//     const maxLength = testTime.length - 1;
//     expect(result).toContain(testString.slice(maxLength - 3, maxLength));
//   });
// });

// describe("utils.whilst()", () => {
//   const mock = vi.fn(() => {});

//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   it("returns undefined when passed a null value", () => {
//     expect(utils.whilst()).toBeUndefined();
//   });
//   it("calls the mock function passed down in the third argument", () => {
//     expect(utils.whilst(null, null, mock)).toBeUndefined();
//     expect(mock).toHaveBeenCalledTimes(1);
//   });
//   it("calls the mock function passed down in the first argument", () => {
//     expect(utils.whilst(mock, null, null)).toBeUndefined();
//     expect(mock).toHaveBeenCalledTimes(1);
//   });
//   it("calls the mock zero times when argument 1 returns false", () => {
//     const testFunction1 = function () {
//       return false;
//     };
//     const testFunction3 = function () {};
//     expect(utils.whilst(testFunction1, mock, testFunction3)).toBeUndefined();
//     expect(mock).toHaveBeenCalledTimes(0);
//   });
//   it("calls the mock one time when argument 1 returns true", () => {
//     const testFunction1 = function () {
//       return true;
//     };
//     const testFunction3 = function () {};
//     expect(utils.whilst(testFunction1, mock, testFunction3)).toBeUndefined();
//     expect(mock).toHaveBeenCalledTimes(1);
//   });
// });

// describe("utils.expBackoff()", () => {
//   beforeEach(() => {
//     vi.useFakeTimers({ shouldAdvanceTime: true });
//   });
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   const mock = vi.fn(() => {});

//   it("returns undefined when passed a null value", () => {
//     expect(utils.expBackoff()).toBeUndefined();
//   });
//   it("returns undefined when passed an empty object", () => {
//     expect(utils.expBackoff({})).toBeUndefined();
//   });
//   it("returns undefined when passed an object with an attempt property", () => {
//     expect(utils.expBackoff({ attempt: 2 })).toBeUndefined();
//   });
//   it("calls the mock function after a timeout", () => {
//     utils.expBackoff({ attempt: 2 }, mock);
//     expect(mock).toHaveBeenCalledTimes(0);
//     vi.runAllTimers();
//     expect(mock).toHaveBeenCalledTimes(1);
//   });
//   it("does not call the mock function if object is missing the 'attempt' property", () => {
//     utils.expBackoff({}, mock);
//     expect(mock).toHaveBeenCalledTimes(1);
//     //TO DO: find better way to check that the mock function has an error in it
//   });
// });

// // started writing unit tests for utils.bind
// //but they gave me trouble so I skipped them for now
// // describe.skip("utils.bind()", () => {
// //   it("throws an error when passed a null value", () => {
// //     expect(utils.bind()).toThrowError();
// //   });
// //   it("returns a function when passed context and a function", () => {
// //     const testContext = ["a", "b"]
// //     const testFunction = (arg1) => { return arg1};
// //     const result = utils.bind(testContext, testFunction, "ccc");
// //     expect(utils.bind(testContext, testFunction)).toBeNull();
// //   });
// // });

// describe("utils.copyObject", () => {
//   it("returns an empty object when passed a null value", () => {
//     expect(utils.copyObject()).toEqual({});
//   });
//   it("returns an object with the first argument as first value when passed a string", () => {
//     expect(utils.copyObject("a")).toEqual({ 0: "a" });
//   });
//   it("returns an empty object when passed a when passed a number", () => {
//     expect(utils.copyObject(1)).toEqual({});
//   });
//   it("returns an object containing the array's values when passed an array", () => {
//     const testArray = ["a", "b", "c"];
//     expect(utils.copyObject(testArray)).toEqual({
//       0: testArray[0],
//       1: testArray[1],
//       2: testArray[2],
//     });
//   });
//   it("returns a matching object", () => {
//     const testObject = { 0: "a", 1: "b", 2: "c" };
//     expect(utils.copyObject(testObject)).toEqual(testObject);
//   });
//   it("returns a matching object, including nested objects", () => {
//     const testObject = { 0: "a", 1: { a: "a", b: { aaa: "a" } }, 2: "c" };
//     expect(utils.copyObject(testObject)).toEqual(testObject);
//   });
// });

// describe("utils.orByProp()", () => {
//   it("returns false when passed a null value", () => {
//     expect(utils.orByProp()).toBe(false);
//   });
//   it("returns the property value of whatever matches the first argument", () => {
//     expect(
//       utils.orByProp("port", { port: 111 }, { port: 222 }, { port: 333 })
//     ).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order)", () => {
//     expect(utils.orByProp("port", { port: 111 }, null, null)).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order 2)", () => {
//     expect(utils.orByProp("port", null, { port: 111 }, null)).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order 3)", () => {
//     expect(utils.orByProp("port", null, null, { port: 111 })).toBe(111);
//   });
//   it("returns undefined if it can't find a matching property", () => {
//     expect(
//       utils.orByProp("foobar", { port: 111 }, { port: 222 }, { port: 333 })
//     ).toEqual(undefined);
//   });
// });

// describe("utils.orByFalseyProp()", () => {
//   it("returns null when passed a null value", () => {
//     expect(utils.orByFalseyProp()).toBeNull();
//   });
//   it("returns null when passed a string", () => {
//     expect(utils.orByFalseyProp("foobar")).toBeNull();
//   });
//   it("returns the property value of whatever matches the first argument", () => {
//     expect(
//       utils.orByFalseyProp("port", { port: 111 }, { port: 222 }, { port: 333 })
//     ).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order)", () => {
//     expect(utils.orByFalseyProp("port", { port: 111 }, null, null)).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order 2)", () => {
//     expect(utils.orByFalseyProp("port", null, { port: 111 }, null)).toBe(111);
//   });
//   it("returns the property value of whatever matches the first argument (different order 3)", () => {
//     expect(utils.orByFalseyProp("port", null, null, { port: 111 })).toBe(111);
//   });
//   it("returns null if it can't find a matching property", () => {
//     expect(
//       utils.orByFalseyProp(
//         "foobar",
//         { port: 111 },
//         { port: 222 },
//         { port: 333 }
//       )
//     ).toBeNull();
//   });
// });

// describe("utils.validateNonNegativeInt()", () => {
//   it("throws an error when passed null values", () => {
//     expect(() => utils.validateNonNegativeInt()).toThrowError();
//   });
//   it("throws an error when passed an array", () => {
//     expect(() => utils.validateNonNegativeInt(["a", "b", "c"])).toThrowError();
//   });
//   it("throws an error when passed an object", () => {
//     expect(() => utils.validateNonNegativeInt({ a: 1, b: 2 })).toThrowError();
//   });
//   it("throws an error when passed non-number string", () => {
//     expect(() => utils.validateNonNegativeInt("asdf")).toThrowError();
//   });
//   it("throws an error when passed an empty string", () => {
//     expect(() => utils.validateNonNegativeInt("")).toThrowError();
//   });
//   it("does not throw an error when passed numerical string", () => {
//     expect(() => utils.validateNonNegativeInt("1")).not.toThrowError();
//   });
//   it("does not throw an error when passed number", () => {
//     expect(() => utils.validateNonNegativeInt(1)).not.toThrowError();
//   });
//   it("when it throws an error, it contains the second argument in the error", () => {
//     const testString = "foobar";
//     expect(() => utils.validateNonNegativeInt("", testString)).toThrowError(
//       testString
//     );
//   });
// });
