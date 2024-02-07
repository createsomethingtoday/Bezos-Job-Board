// greenhouseApi.test.js

import { fetchActiveLocationsForDropdown } from './greenhouseApi';

describe('fetchActiveLocationsForDropdown', () => {
  it('fetches job data and returns it in a structured format for dropdown', async () => {
    const data = await fetchActiveLocationsForDropdown();

    // Log the fetched and structured data to the console for visual inspection
    console.log(JSON.stringify(data, null, 2));

    // Perform your assertions...
    expect(Array.isArray(data)).toBeTruthy();
    data.forEach(group => {
      expect(group).toHaveProperty('label');
      expect(group).toHaveProperty('options');
      expect(Array.isArray(group.options)).toBeTruthy();
      group.options.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
      });
    });
  });
});
