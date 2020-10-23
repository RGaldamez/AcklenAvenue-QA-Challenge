# AcklenAvenue-QA-Challenge
This repository shows the creation of the automated tests to display functionality and bugs of the web page provided to test on.

## Before you begin:
 Make sure you download a browser driver for your Google Chrome version. 
 For your convenience here is the link containing the **[Chrome Drivers](http://chromedriver.storage.googleapis.com/index.html)**

 * Download the driver into a new folder which you can easily access like C:\SeleniumWebDrivers if using Windows
 * Add that new folder to your PATH variable 

## Once that's done, clone this repository and follow the next steps:
1. Go into the repository folder
   
2. Use the command following command to install dependencies:
   ```
   npm install 
   ```
3. Once the dependencies finish installing, you can start the tests using the next command:
   ```
   npm run test
   ```

4. You should be able to visualize the tests being automatically done and the final results will show in the console.

## Notes
* To create the test cases, I made a test case template in an Excel Worksheet which is included in the repository.
* Navigate through the test cases in the Excel Worksheet using the bottom menu tabs.
* Tools used are: [Selenium webdriver](https://www.npmjs.com/package/selenium-webdriver), [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/).