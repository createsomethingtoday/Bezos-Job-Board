// utils.js

export const createStateCityStructure = (offices) => {

    const stateCityMap = {};
  
    offices.forEach(office => {
  
      if(!office.location) {
        return; 
      }
  
      const locationParts = office.location.split(', ');
      
      if(locationParts.length < 2) {
        return;
      }
  
      const [, state] = locationParts;
      
      if(!stateCityMap[state]) {
        stateCityMap[state] = [];
      }
  
      stateCityMap[state].push({
        id: office.id,
        name: office.name
      });
  
    });
  
    return Object.keys(stateCityMap).map(state => ({
      label: state,
      options: stateCityMap[state].map(city => ({
        value: city.id,
        label: city.name
      }))
    }));
  
  };