fetch("jazz_legends_extended.json")
  .then(res => res.json())
  .then(data => {
    const counts = {};
    data.forEach(item => {
      counts[item.Decade] = (counts[item.Decade] || 0) + 1;
    });

    const chartCtx = document.getElementById("decadeChart").getContext("2d");
    new Chart(chartCtx, {
      type: "bar",
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: "Number of Artists",
          data: Object.values(counts),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } }
      }
    });

    const map = L.map("map").setView([38, -95], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    data.forEach(artist => {
      const marker = L.marker([artist.Lat, artist.Lng]).addTo(map);
      marker.bindPopup(`<strong>${artist.Artist}</strong><br>${artist.Birthplace}`);
    });

    const ytContainer = document.getElementById("youtubeContainer");
    data.forEach(artist => {
      const iframe = document.createElement("iframe");
      const videoId = new URL(artist.YouTube).searchParams.get("v");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = `${artist.Artist} - ${artist.FamousWork}`;
      ytContainer.appendChild(iframe);
    });
  });
