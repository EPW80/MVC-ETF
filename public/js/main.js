let chartInstance = null;

document
  .getElementById("stockForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const symbol = document.getElementById("symbol").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
      const response = await fetch(
        `/data?symbol=${symbol}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      // Log the data to verify the structure
      console.log("Received data:", data);

      const factor = 5; // Downsample factor, adjust this value as needed
      const downsampledData = downsampleData(data, factor);

      const labels = downsampledData.map((item) => item.date);
      const prices = downsampledData.map((item) => item.close);

      // Calculate SMAs
      const shortWindow = 50;
      const longWindow = 200;
      const shortSMA = calculateSMA(prices, shortWindow);
      const longSMA = calculateSMA(prices, longWindow);

      // Log the SMAs
      console.log("Short SMA:", shortSMA);
      console.log("Long SMA:", longSMA);

      const canvas = document.getElementById("chart");
      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (chartInstance) {
            chartInstance.destroy();
          }
          chartInstance = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Close Price",
                  data: prices,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderWidth: 2,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "rgba(75, 192, 192, 1)",
                },
                {
                  label: `SMA ${shortWindow}`,
                  data: shortSMA,
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderWidth: 2,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "rgba(255, 99, 132, 1)",
                },
                {
                  label: `SMA ${longWindow}`,
                  data: longSMA,
                  borderColor: "rgba(54, 162, 235, 1)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderWidth: 2,
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "rgba(54, 162, 235, 1)",
                },
              ],
            },
            options: {
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "day",
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    color: "rgba(189, 195, 199, 0.2)",
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#34495e",
                  },
                },
              },
              maintainAspectRatio: false, // Ensure consistent size
            },
          });
        } else {
          console.error("Unable to get 2D context from canvas");
        }
      } else {
        console.error('Element with id "chart" is not a canvas element');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

// Function to calculate SMA
function calculateSMA(data, window) {
  let sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < window; j++) {
        sum += data[i - j];
      }
      sma.push(sum / window);
    }
  }
  return sma;
}

// Function to downsample data
function downsampleData(data, factor) {
  return data.filter((_, index) => index % factor === 0);
}
