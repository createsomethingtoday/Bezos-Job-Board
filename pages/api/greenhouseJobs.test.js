// greenhouseJobs.test.js

const fetch = require('node-fetch'); // Ensure node-fetch is installed in your project

describe('Greenhouse Jobs API', () => {
  it('fetches job details and logs the data structure', async () => {
    const response = await fetch('http://localhost:3000/api/greenhouseJobs'); // Adjust the URL as needed
    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    // Perform your assertions here
    expect(Array.isArray(data)).toBeTruthy();
    if (data.length > 0) {
      const sampleJob = data[0];
      expect(sampleJob).toHaveProperty('id');
      expect(sampleJob).toHaveProperty('title');
      // Add more assertions based on expected properties
    }
  });
});
