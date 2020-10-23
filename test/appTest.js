const {Builder, By} = require('selenium-webdriver');
const assert = require('chai').assert;
const mainFunction = require('../app').mainFunction;

const URL = 'http://www.shino.de/parkcalc/';
const INPUT_TIME=200;
const PAGE_LOADING_TIME=500;
const TEST_TIMEOUT=100000;
let driver;
let entryDate, entryTime,leavingDate,leavingTime;
let result ,result2;

describe('Selenium automated functional tests', function(){
    // Unit tests should usually last INPUT_TIME0ms so I am increasing the timeout
    // to allow selenium to perform the tests
    this.timeout(TEST_TIMEOUT);

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
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('GASHDHASDGASJDH');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('asdasdasdqwd');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('asdqweq3tesgfsdf');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//b')).getText();
            assert.isUndefined(result, 'php warnings found');  
        });

        it('Press calculate with default values, user friendly error should show and no php warnings ', async ()=>{

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
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
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
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
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('5:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('10:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 12.00');  
        });

        it('Select valet parking for 6 hours, cost should be $18', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('5:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('11:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 18.00');  
        });

        it('Selecting 3 days of valet parking, cost should be $54', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Valet Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/25/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
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
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('1:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('2:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 2.00');  
        });
        it('Selecting 5 hours of Short-Term Parking, cost should be $10', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Short-Term Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('1:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 10.00');  
        });
        it('Selecting 2 days, 6 hours and 29 minutes of Short-Term Parking, cost should be $61', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Short-Term Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/24/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:29');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            assert.equal(result, '$ 61.00');  
        });
        
    });
    describe('Economy Parking tests', async ()=>{
        it('Economy parking for 4 hours and 59 minutes, cost should be $9 or under ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Economy Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('4:59');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.isAtMost(result, 9.00);
            
        });
        it('Economy parking for 24 hours , cost should be $9 ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Economy Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 9.00);
            
        });
        it('Economy parking for 31 days, cost should be $243', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Economy Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/1/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('11/1/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 243.00);
            
        });
        it('Comparing 6 days of economy parking with 7, should be the same cost ($54)', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Economy Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/29/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);


            await driver.findElement(By.name('ParkingLot')).sendKeys('Economy Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/28/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result2 = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result2 = result2.replace('$','');
            result2 = parseFloat(result2);
            
            assert.equal(result,result2);
            
            
        });
    });
    describe('Long-Term Garage Parking tests' , async ()=>{
        it('Long-Term Garage Parking for 6 hours and 59 minutes, cost should be $12 or under ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Garage Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:59');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.isAtMost(result, 12.00);
            
        });
        it('Long-Term Garage Parking for 24 hours , cost should be $12 ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Garage Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 12.00);
            
        });
        it('Long-Term Garage Parking for 31 days, cost should be $324', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Garage Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/1/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('11/1/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 324.00);
            
        });
        it('Comparing 6 days of Long-Term Garage Parking with 7, should be the same cost ($72)', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Garage Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/29/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);


            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Garage Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/28/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result2 = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result2 = result2.replace('$','');
            result2 = parseFloat(result2);
            
            assert.equal(result,result2);
            
            
        });
    });
    describe('Long-Term Surface Parking tests', async ()=>{
        it('Long-Term Surface Parking for 6 hours and 59 minutes, cost should be $12 or under ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Surface Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('6:59');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.isAtMost(result, 12.00);
            
        });
        it('Long-Term Surface Parking for 24 hours , cost should be $12 ', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Surface Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/23/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 12.00);
            
        });
        it('Long-Term Surface Parking for 31 days, cost should be $324', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Surface Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/1/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('11/1/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);
            assert.equal(result, 324.00);
            
        });
        it('Comparing 6 days of Long-Term Surface Parking with 7, should be the same cost ($72)', async ()=>{

            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Surface Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/29/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result = result.replace('$','');
            result = parseFloat(result);


            await driver.findElement(By.name('ParkingLot')).sendKeys('Long-Term Surface Parking');
            entryDate = await driver.findElement(By.name('StartingDate'));
            entryDate.clear();
            entryDate.sendKeys('10/22/2020');
            await driver.sleep(INPUT_TIME);

            entryTime = await driver.findElement(By.name('StartingTime'));
            entryTime.clear();
            entryTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            leavingDate = await driver.findElement(By.name('LeavingDate'));
            leavingDate.clear();
            leavingDate.sendKeys('10/28/2020');
            await driver.sleep(INPUT_TIME);

            leavingTime = await driver.findElement(By.name('LeavingTime'));
            leavingTime.clear();
            leavingTime.sendKeys('12:00');
            await driver.sleep(INPUT_TIME);

            await driver.findElement(By.name('Submit')).click();
            await driver.sleep(PAGE_LOADING_TIME);
            
            result2 = await driver.findElement(By.xpath('//span[@class="SubHead"]/b')).getText();
            result2 = result2.replace('$','');
            result2 = parseFloat(result2);
            
            assert.equal(result,result2);
            
            
        });
    })

    


});