import { generateXcodeReport, danger } from "./index"

declare const global: any

describe("generateXcodeReport()", () => {
  beforeEach(() => {
    global.warn = jest.fn()
    global.message = jest.fn()
    global.fail = jest.fn()
    global.markdown = jest.fn()
  })

  afterEach(() => {
    global.warn = undefined
    global.message = undefined
    global.fail = undefined
    global.markdown = undefined
  })

  it("Needs a real json file", () => {
    global.danger = {
      github: { pr: { title: "My Test Title", base: { repo: { name: "testRepo" } } } },
    }

    generateXcodeReport({})

    expect(global.warn).toHaveBeenCalledWith(
      ":mag: Can't find xcpretty report at `./build/reports/errors.json`, skipping generating Xcode Report."
    )
  })

  it("Checks summary message was posted", () => {
    // Object.defineProperty(danger, "github", { "pr": { "title": "My Test Title", base: { repo: { name: "testRepo" } } } });
    global.danger = {
      "github": { "pr": { "title": "My Test Title", "base": { "repo": { "name": "testRepo" } } } }
    }
  
    generateXcodeReport({ pathToReport: "./fixtures/errors.json" })

    expect(global.message).toHaveBeenCalledWith(
      "Executed 166 tests, with 4 failures (0 unexpected) in 0.234 (0.309) seconds",
    )
  })
})
