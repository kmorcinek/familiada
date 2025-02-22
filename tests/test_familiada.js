const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const path = require('path');

describe('Familiada Game Tests', function() {
    let gameDriver;
    let controlDriver;
    
    // Increase timeout for slower operations
    this.timeout(60000);

    beforeEach(async function() {
        // Create two separate Chrome windows
        gameDriver = await new Builder().forBrowser('chrome').build();
        controlDriver = await new Builder().forBrowser('chrome').build();
        
        const htmlPath = path.join(__dirname, '..');
        await gameDriver.get(`file://${htmlPath}/index.html`);
        await controlDriver.get(`file://${htmlPath}/controller.html`);
    });

    afterEach(async function() {
        if (gameDriver) await gameDriver.quit();
        if (controlDriver) await controlDriver.quit();
    });

    it('should initialize both windows correctly', async function() {
        // Check game window
        const title = await gameDriver.findElement(By.css('h1'));
        expect(await title.getText()).to.equal('Familiada');
        
        const team1Input = await gameDriver.findElement(By.css('.team1 .team-input'));
        expect(await team1Input.getAttribute('value')).to.equal('Drużyna 1');
        
        const team2Input = await gameDriver.findElement(By.css('.team2 .team-input'));
        expect(await team2Input.getAttribute('value')).to.equal('Drużyna 2');
        
        const showQuestionBtn = await gameDriver.findElement(By.id('show-question-btn'));
        expect(await showQuestionBtn.isDisplayed()).to.be.true;

        // Check controller window
        const controllerTitle = await controlDriver.findElement(By.css('h2'));
        expect(await controllerTitle.getText()).to.equal('Kontroler odpowiedzi');
    });

    it('should show question and enable controller when show question button is clicked', async function() {
        const showQuestionBtn = await gameDriver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await gameDriver.sleep(1000);

        // Check game window
        const question = await gameDriver.findElement(By.className('question'));
        expect(await question.isDisplayed()).to.be.true;

        const answers = await gameDriver.findElement(By.id('answers'));
        expect(await answers.isDisplayed()).to.be.true;

        const wrongAnswerSection = await gameDriver.findElement(By.className('wrong-answer-section'));
        expect(await wrongAnswerSection.isDisplayed()).to.be.true;

        // Check controller window
        const answerButtons = await controlDriver.findElements(By.className('answer-button'));
        expect(answerButtons.length).to.be.greaterThan(0);
    });

    it('should handle wrong answers and controller interaction correctly', async function() {
        const showQuestionBtn = await gameDriver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await gameDriver.sleep(1000);

        // Click first answer in controller
        const firstAnswerBtn = await controlDriver.findElement(By.className('answer-button'));
        await firstAnswerBtn.click();
        await controlDriver.sleep(5000); // Wait for animation

        // Check if answer is visible in game window
        const firstAnswer = await gameDriver.findElement(By.id('answer-0'));
        expect(await firstAnswer.getAttribute('class')).to.include('visible');

        // Handle wrong answers in game window
        const wrongAnswerBtn = await gameDriver.findElement(By.id('wrong-answer-btn'));
        for (let i = 0; i < 3; i++) {
            await wrongAnswerBtn.click();
            await gameDriver.sleep(5000);
        }

        const wrongMarks = await gameDriver.findElements(By.className('wrong-mark'));
        expect(wrongMarks.length).to.equal(3);
        expect(await wrongAnswerBtn.isDisplayed()).to.be.false;
    });

    it('should handle points system with controller interaction', async function() {
        const showQuestionBtn = await gameDriver.findElement(By.id('show-question-btn'));
        await showQuestionBtn.click();
        await gameDriver.sleep(1000);

        // Show first answer using controller
        const firstAnswerBtn = await controlDriver.findElement(By.className('answer-button'));
        await firstAnswerBtn.click();
        await controlDriver.sleep(5000);

        // Add points to team 1
        const team1AddBtn = await gameDriver.findElement(By.id('team1-add'));
        await team1AddBtn.click();
        await gameDriver.sleep(5000);

        // Check if points were added and buttons are disabled
        const team1Points = await gameDriver.findElement(By.id('team1-points'));
        expect(await team1Points.getAttribute('value')).to.not.equal('0');

        const team2AddBtn = await gameDriver.findElement(By.id('team2-add'));
        expect(await team1AddBtn.getAttribute('disabled')).to.equal('true');
        expect(await team2AddBtn.getAttribute('disabled')).to.equal('true');

        // Check if next question button is visible
        const nextQuestionBtn = await gameDriver.findElement(By.id('next-question-btn'));
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
