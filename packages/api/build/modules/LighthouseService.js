import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
// import { Result } from 'lighthouse/types/lhr/audit-result'
//import { CustomConfig } from '../types/interfaces.ts'
class ChromeLauncherService {
    chromeConfig;
    constructor(chromeConfig) {
        this.chromeConfig = chromeConfig;
    }
    async launchChrome() {
        // await chromeLauncher.launch(this.chromeConfig)
        try {
            const chrome = await chromeLauncher.launch({
                chromeFlags: [
                    "--headless",
                    "--no-sandbox",
                    "--remote-debugging-port=9222",
                ],
                chromePath: 
                //"/home/a/a/new/packages/api/chrome/linux-132.0.6834.159/chrome-linux64/chrome",
                "/opt/render/project/src/packages/api/build/chrome/google-chrome-stable",
                //"/opt/render/project/src/packages/api/chrome/" +
                //fs .readdirSync("/opt/render/project/src/packages/api/chrome/")
                //  .sort()
                //  .pop() +
                //"/chrome-linux64/chrome",
            });
            console.log(`Chrome launched at: ${chrome.port}`);
        }
        catch (error) {
            console.log(error);
        }
        // chromeFlags: ['--headless', '--no-sandbox'],
        // chromePath: '/home/a/a/new/api/chrome/linux-132.0.6834.159/chrome-linux64/chrome',
    }
}
class LighthouseService {
    config;
    constructor(config) {
        this.config = config;
    }
    async runTest(url) {
        //initialize chrome
        try {
            const options = {
                extends: this.config.extends || "lighthouse:default",
                settings: {
                    onlyAudits: ["first-meaningful-paint"],
                    onlyCategories: ["performance"],
                },
            };
            // await chromeLauncher.launch({
            //   chromeFlags: ['--headless', '--no-sandbox'],
            //   chromePath: '/home/a/a/new/api/chrome/linux-132.0.6834.159/chrome-linux64/chrome',
            // })
            return await lighthouse(url, options);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
        //
        // const report = lighthouseInstance.run(url, { output: 'json' }).then((report) => { console.log(report) }).then((error) => { console.log(error) })
        // console.log(report)
    }
}
export { ChromeLauncherService };
export default LighthouseService;
