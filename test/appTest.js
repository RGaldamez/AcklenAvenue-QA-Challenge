const {Builder, By} = require('selenium-webdriver');
const assert = require('mocha').assert;
const mainFunction = require('../app').mainFunction;

const URL = 'http://www.shino.de/parkcalc/'
let driver;

describe('Selenium functional tests', function(){
    // Unit tests usually last 2000ms so I am increasing the timeout
    // to allow selenium to perform the tests
    this.timeout(40000);

    before(async ()=>{
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get(URL);
    });

    after(async ()=>{
        await driver.quit();
    });

    it('Calculate with default values set', async ()=>{
        await driver.findElement(By.name('Submit')).click();
        await driver.sleep(2000);
    });



});