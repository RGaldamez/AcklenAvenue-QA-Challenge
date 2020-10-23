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
    this.timeout(100000);

    before(async ()=>{
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get(URL);
    });

    after(async ()=>{
        await driver.quit();
    });

    describe('General tampering tests', async ()=>{
        it('Input letters in the date and time boxes, no PHP warnings should appear', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('ASDasdjaskduqwjsi');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('GASHDHASDGASJDH');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('asdasdasdqwd');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('asdqweq3tesgfsdf');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//b')).getText();
            assert.isUndefined(result, 'php warnings found');  
        });

        it('Press calculate with default values, user friendly error should show and no php warnings ', async ()=>{

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//b')).getText();
            assert.isUndefined(result, 'php warnings found');  
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, 'ERROR! ENTER A CORRECTLY FORMATTED DATE');
        });

        it('Put a leaving date that happens before the entry date, app should prompt friendly user error', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/30/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/22/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(1000);
            
            result = await driver.findElement(By.xpath('//td[@class="SubHead"]/b')).getText();
            assert.equal(result, 'ERROR! YOUR LEAVING DATE OR TIME IS BEFORE YOUR STARTING DATE OR TIME');  
        });
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

        it('Select valet parking for 6 hours, cost should be $18', async ()=>{

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
            leavingTime.sendKeys('11:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 18.00');  
        });

        it('Selecting 3 days of valet parking, cost should be $54', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/25/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 54.00');  
        });

        
    });

    describe('Short-Term Parking tests', async ()=>{
        it('Selecting 1 hour of Short-Term Parking, cost should be $2', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Short-Term Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('1:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('2:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 2.00');  
        });
        it('Selecting 5 hours of Short-Term Parking, cost should be $10', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Short-Term Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('1:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:00');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 10.00');  
        });
        it('Selecting 2 days, 6 hours and 29 minutes of Short-Term Parking, cost should be $61', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Short-Term Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(200);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(200);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/24/2020');
            await driver.sleep(200);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:29');
            await driver.sleep(200);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(500);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 61.00');  
        });
    });

    


});