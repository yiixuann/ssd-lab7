import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

(async function testTimestamp() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Start the server before running the test

        const seleniumUrl = 'http://selenium:4444/wd/hub'; // Selenium server URL

        // Initialize the WebDriver with Chrome
        const driver = await new Builder()
            .forBrowser('chrome')
            .usingServer(seleniumUrl) // Specify the Selenium server
            .build();

        // for local selenium testing
        //const serverUrl = 'http://localhost:3000';

        // for github action selenium testing
        const serverUrl = 'http://testserver:3000'; // Adjust port if necessary
        
        await driver.get(serverUrl);

        // Wait for the timestamp to appear on the page
        let timestampElement = await driver.wait(
            until.elementLocated(By.id('timestamp')), // Assuming the timestamp has an id of 'timestamp'
            5000 // Timeout in milliseconds
        );

        // Get the timestamp text
        let timestampText = await timestampElement.getText();
        console.log(`Timestamp: ${timestampText}`);

        // Extract the actual timestamp after "Server timestamp: "
        const timestampMatch = timestampText.match(/Server timestamp:\s*(.*)/);
        assert.ok(timestampMatch, 'Timestamp text does not match expected format');
        const extractedTimestamp = timestampMatch[1];

        // Validate the timestamp format (ISO 8601 format)
        const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        assert.match(extractedTimestamp, timestampRegex, 'Timestamp format is invalid');
        console.log('Timestamp format is valid.');

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        // Quit the browser session
        await driver.quit();
    }
})();
