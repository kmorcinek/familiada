const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');

describe('Familiada Game Tests', function() {
    let driver;
    
    // Increase timeout for slower operations
    this.timeout(60000); // Zwiększenie timeoutu do 60 sekund

    beforeEach(async function() {
        driver = await new Builder().forBrowser('chrome').build();
        const htmlPath = path.join(__dirname, '..', 'index.html');
        await driver.get(`file://${htmlPath}`);
    });

    afterEach(async function() {
        await driver.quit();
    });

    it('should play through complete game flow with multiple answers and wrong answers', async function() {
        try {
            // 1. Check title
            const title = await driver.findElement(By.css('h1'));
            expect(await title.getText()).to.equal('Familiada');

            // 2. Click 'Show question'
            const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
            await showQuestionBtn.click();
            await driver.sleep(1000); // Wait for animations

            // Check if question is visible
            const question = await driver.findElement(By.className('question'));
            expect(await question.isDisplayed()).to.be.true;

            // 3. Click 'Show' for first three answers
            for (let i = 0; i < 3; i++) {
                const showAnswerBtn = await driver.findElement(By.id(`button-${i}`));
                await showAnswerBtn.click();
                await driver.sleep(6000); // Dłuższe oczekiwanie na dźwięk, animacje i tooltip
            }

            // 4. Click wrong answer button twice
            const wrongAnswerBtn = await driver.findElement(By.id('wrong-answer-btn'));
            for (let i = 0; i < 2; i++) {
                await wrongAnswerBtn.click();
                await driver.sleep(3000); // Czekaj na dźwięk i animacje
            }

            // 5. Click '+' for first team
            const addPointsBtn = await driver.findElement(By.id('team1-add'));
            await addPointsBtn.click();

            // 5. Check if points were added
            const team1Points = await driver.findElement(By.id('team1-points'));
            expect(await team1Points.getAttribute('value')).to.not.equal('0');

            // 6. Check if 'Next question' button is visible
            const nextQuestionBtn = await driver.findElement(By.id('next-question-btn'));
            expect(await nextQuestionBtn.isDisplayed()).to.be.true;

            // 7. Go to next question and repeat process
            await nextQuestionBtn.click();
            await driver.sleep(3000);

            // 8. Show question for second round
            const secondShowQuestionBtn = await driver.findElement(By.id('show-question-btn'));
            await secondShowQuestionBtn.click();
            await driver.sleep(3000);

            // 9. Show two answers in second round
            for (let i = 0; i < 2; i++) {
                const showAnswerBtn = await driver.findElement(By.id(`button-${i}`));
                await showAnswerBtn.click();
                await driver.sleep(3000);
            }

            // 10. Add points for second team
            const team2AddBtn = await driver.findElement(By.id('team2-add'));
            await team2AddBtn.click();
            await driver.sleep(3000);

            // 11. Check if game reset
            const newShowQuestionBtn = await driver.findElement(By.id('show-question-btn'));
            expect(await newShowQuestionBtn.isDisplayed()).to.be.true;

        } catch (error) {
            // Save screenshot on error
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('error.png', screenshot, 'base64');
            throw error;
        }
    });
});
