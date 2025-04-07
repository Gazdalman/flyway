async function handleSearch() {
  const searchInput = document.getElementById("search").value.toLowerCase().trim();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  try {
    const jsonURL = "data/travel_recommendation_api.json";
    const response = await fetch(jsonURL);
    if (!response.ok) throw new Error("Failed to fetch recommendations.");

    const data = await response.json();
    let matches = [];

    // Check in each category
    Object.keys(data).forEach(category => {
      data[category].forEach(item => {
        // For countries, check the country name and loop through its cities
        if (category === "countries") {
          if (item.name.toLowerCase().includes(searchInput)) {
            matches.push(...item.cities); // Add all cities of the matched country
          } else {
            item.cities.forEach(city => {
              if (
                city.name.toLowerCase().includes(searchInput) ||
                city.description.toLowerCase().includes(searchInput)
              ) {
                matches.push(city);
              }
            });
          }
        } else {
          // For beaches or temples
          if (
            item.name.toLowerCase().includes(searchInput) ||
            item.description.toLowerCase().includes(searchInput)
          ) {
            matches.push(item);
          }
        }
      });
    });

    if (matches.length > 0) {
      matches.forEach(item => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result");

        // const img = document.createElement("img");
        // // img.src = item.imageUrl || "fallback.jpg"; // Add a fallback if no image
        // img.alt = item.name;

        const name = document.createElement("h3");
        name.textContent = item.name;

        const description = document.createElement("p");
        description.textContent = item.description;

        // resultDiv.appendChild(img);
        resultDiv.appendChild(name);
        resultDiv.appendChild(description);

        resultsContainer.appendChild(resultDiv);
        console.log(resultsContainer);
      });
    } else {
      resultsContainer.innerHTML = "<p>No recommendations found for your search.</p>";
    }

  } catch (error) {
    resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

const searchBtn = document.getElementById("srchBtn");
searchBtn.addEventListener("click", handleSearch);
