import * as chromeLauncher from 'chrome-launcher'
import lighthouse, { Config } from "lighthouse"

class LighthouseService {

  private config: Config
  constructor(config: Config) {
    this.config = config
  }

  async runTest(url: string): Promise<any | void> {


    //initialize chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox'],
      chromePath: '/home/a/a/new/api/chrome/linux-132.0.6834.159/chrome-linux64/chrome'
    })

    const options: Config = {
      extends: this.config.extends || 'lighthouse:default',
      output: this.config.output || 'json',
      settings: {
        onlyAudits: ['first-meaningful-paint']
      },
      port: chrome.port,
      onlyCategories: ['performance']
    }

    try {
      const report = await lighthouse(url, options)
      return report
    }
    catch (e) { console.error("report", e) }

    //
    // const report = lighthouseInstance.run(url, { output: 'json' }).then((report) => { console.log(report) }).then((error) => { console.log(error) })
    // console.log(report)
  }
}
export default LighthouseService







