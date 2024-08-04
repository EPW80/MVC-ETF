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

      const labels = data.map((item) => item.date);
      const prices = data.map((item) => item.close);

      // Log the mapped data
      console.log("Labels:", labels);
      console.log("Prices:", prices);

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
