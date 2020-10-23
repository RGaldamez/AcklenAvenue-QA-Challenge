const {Builder, By} = require('selenium-webdriver');
const assert = require('chai').assert;
const mainFunction = require('../app').mainFunction;

const URL = 'http://www.shino.de/parkcalc/';
let driver;
let entryDate, entryTime,leavingDate,leavingTime;
let resultContainer, result;

describe('Selenium automated functional tests', function(){
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

    describe('Valet Parking Tests', async ()=>{
        it('Selecting Valet parking for 5 hours, cost should be $12', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('5:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('10:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 12.00');  
        });
    });



});