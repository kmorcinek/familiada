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

    it('should initialize game correctly', async function() {
        const title = await driver.findElement(By.css('h1'));
        expect(await title.getText()).to.equal('Familiada');
        
        const team1Input = await driver.findElement(By.css('.team1 .team-input'));
        expect(await team1Input.getAttribute('value')).to.equal('Drużyna 1');
        
        const team2Input = await driver.findElement(By.css('.team2 .team-input'));
        expect(await team2Input.getAttribute('value')).to.equal('Drużyna 2');
        
        const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        expect(await showQuestionBtn.isDisplayed()).to.be.true;
    });

    it('should show question and answers when show question button is clicked', async function() {
        const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await driver.sleep(1000);

        const question = await driver.findElement(By.className('question'));
        expect(await question.isDisplayed()).to.be.true;

        const answers = await driver.findElement(By.id('answers'));
        expect(await answers.isDisplayed()).to.be.true;

        const wrongAnswerSection = await driver.findElement(By.className('wrong-answer-section'));
        expect(await wrongAnswerSection.isDisplayed()).to.be.true;
    });

    it('should handle wrong answers correctly', async function() {
        const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await driver.sleep(1000);

        const wrongAnswerBtn = await driver.findElement(By.id('wrong-answer-btn'));
        
        // Click wrong answer three times
        for (let i = 0; i < 3; i++) {
            await wrongAnswerBtn.click();
            await driver.sleep(1000);
        }

        // Check if wrong answer marks are visible
        const wrongMarks = await driver.findElements(By.className('wrong-mark'));
        expect(wrongMarks.length).to.equal(3);

        // Check if wrong answer button is hidden after 3 wrong answers
        expect(await wrongAnswerBtn.isDisplayed()).to.be.false;
    });

    it('should handle points system correctly', async function() {
        const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await driver.sleep(1000);

        // Show first answer through BroadcastChannel simulation
        await driver.executeScript(`
            const answer = document.getElementById('answer-0');
            answer.classList.add('visible');
        `);

        // Add points to team 1
        const team1AddBtn = await driver.findElement(By.id('team1-add'));
        await team1AddBtn.click();

        // Check if points were added and buttons are disabled
        const team1Points = await driver.findElement(By.id('team1-points'));
        expect(await team1Points.getAttribute('value')).to.not.equal('0');

        const team2AddBtn = await driver.findElement(By.id('team2-add'));
        expect(await team1AddBtn.getAttribute('disabled')).to.equal('true');
        expect(await team2AddBtn.getAttribute('disabled')).to.equal('true');

        // Check if next question button is visible
        const nextQuestionBtn = await driver.findElement(By.id('next-question-btn'));
        expect(await nextQuestionBtn.isDisplayed()).to.be.true;
    });

    it('should handle next question functionality', async function() {
        // Show and complete first question
        const showQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await driver.sleep(1000);

        await driver.executeScript(`
            const answer = document.getElementById('answer-0');
            answer.classList.add('visible');
        `);

        const team1AddBtn = await driver.findElement(By.id('team1-add'));
        await team1AddBtn.click();

        // Go to next question
        const nextQuestionBtn = await driver.findElement(By.id('next-question-btn'));
        await nextQuestionBtn.click();
        await driver.sleep(1000);

        // Check if game state was reset
        const newShowQuestionBtn = await driver.findElement(By.id('show-question-btn'));
        expect(await newShowQuestionBtn.isDisplayed()).to.be.true;

        const wrongMarks = await driver.findElements(By.className('wrong-mark'));
        expect(wrongMarks.length).to.equal(0);
    });
});
