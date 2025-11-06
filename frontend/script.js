
    // ⚙️ Change this to your deployed backend URL:
    const API_BASE = "https://stocks-quontify.onrender.com/api/stocks";

    const symbolInput = document.getElementById("symbol");
    const addBtn = document.getElementById("addBtn");
    const stockList = document.getElementById("stockList");

    async function loadStocks() {
      stockList.innerHTML = "<li>Loading...</li>";
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        stockList.innerHTML = "";
        data.stocks.forEach(symbol => {
          const li = document.createElement("li");
          li.textContent = symbol;
          stockList.appendChild(li);
        });
      } catch (err) {
        stockList.innerHTML = "<li style='color:red;'>Error loading stocks</li>";
      }
    }

    async function addStock() {
      const symbol = symbolInput.value.trim().toUpperCase();
      if (!symbol) return alert("Enter a stock symbol");
      try {
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol })
        });
        const data = await res.json();
        if (res.ok) {
          alert("✅ Added: " + symbol);
          symbolInput.value = "";
          loadStocks();
        } else {
          alert("❌ Error: " + (data.error || data.errors?.[0]?.msg));
        }
      } catch (err) {
        alert("Server error");
      }
    }

    addBtn.addEventListener("click", addStock);
    loadStocks();
 