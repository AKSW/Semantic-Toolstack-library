// src/utils/helper.js

// Constants
const service = import.meta.env.VITE_SERVICE_URL;
const delimiter = "xXXXx";
export { delimiter };

// Another helper function
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function triggerService(iri) {
  const url = service+'/updateRepoData/?iri='+iri;

  try {
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }

    const data = await response.json(); // Parse the JSON of the response
    console.log(data); // Log the data
    return data;
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    return {};
  }
}
