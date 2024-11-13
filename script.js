
// Expanded stock list
const stocksList = [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'ITC', name: 'ITC' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
    { symbol: 'LT', name: 'Larsen & Toubro' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki' },
    { symbol: 'AXISBANK', name: 'Axis Bank' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma' }
];

class MarketDataSimulator {
    constructor() {
        this.baseValues = {
            'NIFTY 50': 19425.50,
            'SENSEX': 64112.65,
            'BANK NIFTY': 43562.30
        };
        this.stocksData = {};
        stocksList.forEach(stock => {
            this.stocksData[stock.symbol] = {
                price: Math.random() * 1000 + 1000,
                basePrice: Math.random() * 1000 + 1000
            };
        });
        this.volatility = 0.002;
        this.subscribers = [];
        this.isRunning = false;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.simulate();
        }
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    simulate() {
        const updateData = () => {
            const data = {
                indices: {},
                stocks: {}
            };

            // Update indices
            for (const [index, baseValue] of Object.entries(this.baseValues)) {
                const change = baseValue * this.volatility * (Math.random() * 2 - 1);
                const newValue = baseValue + change;
                this.baseValues[index] = newValue;
                
                data.indices[index] = {
                    price: newValue.toFixed(2),
                    change: change.toFixed(2),
                    percentChange: ((change / baseValue) * 100).toFixed(2)
                };
            }

            // Update stocks
            for (const [symbol, stockData] of Object.entries(this.stocksData)) {
                const change = stockData.basePrice * this.volatility * (Math.random() * 2 - 1);
                const newPrice = stockData.price + change;
                this.stocksData[symbol].price = newPrice;
                
                data.stocks[symbol] = {
                    price: newPrice.toFixed(2),
                    change: change.toFixed(2),
                    percentChange: ((change / stockData.price) * 100).toFixed(2),
                    volume: Math.floor(Math.random() * 1000000)
                };
            }

            this.subscribers.forEach(callback => callback(data));
        };

        updateData();
        setInterval(updateData, 2000);
    }
}

function initializeChart() {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const timeLabels = Array.from({length: 30}, (_, i) => `${9 + Math.floor(i/2)}:${i % 2 ? '30' : '00'}`);
    
    const niftyData = Array.from({length: 30}, () => Math.random() * 200 + 19300);
    const sensexData = Array.from({length: 30}, () => Math.random() * 500 + 63800);
    const bankNiftyData = Array.from({length: 30}, () => Math.random() * 300 + 43300);

    const data = {
        labels: timeLabels,
        datasets: [
            {
                label: 'NIFTY 50',
                data: niftyData,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                type: 'line',
                tension: 0.4,
                order: 1
            },
            {
                label: 'SENSEX',
                data: sensexData,
                borderColor: '#00bfff',
                backgroundColor: 'rgba(0, 191, 255, 0.1)',
                type: 'line',
                tension: 0.4,
                order: 1
            },
            {
                label: 'BANK NIFTY',
                data: bankNiftyData,
                borderColor: '#ff4500',
                backgroundColor: 'rgba(255, 69, 0, 0.1)',
                type: 'line',
                tension: 0.4,
                order: 1
            },
            {
                label: 'Volume',
                data: niftyData.map(() => Math.random() * 1000000),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                type: 'bar',
                order: 2
            }
        ]
    };

    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function updateGainersLosers(stocksData) {
    const sortedStocks = Object.entries(stocksData)
        .map(([symbol, data]) => ({
            symbol,
            ...data
        }))
        .sort((a, b) => parseFloat(b.percentChange) - parseFloat(a.percentChange));

    const gainers = sortedStocks.slice(0, 5);
    const losers = sortedStocks.slice(-5).reverse();

    const gainersHTML = gainers.map(stock => createStockItem(stock)).join('');
    const losersHTML = losers.map(stock => createStockItem(stock)).join('');

    document.getElementById('topGainers').innerHTML = gainersHTML;
    document.getElementById('topLosers').innerHTML = losersHTML;
}

function createStockItem(stock) {
    const changeClass = parseFloat(stock.percentChange) >= 0 ? 'positive' : 'negative';
    return `
        <div class="stock-item">
            <div class="stock-details">
                <div class="stock-name">${stock.symbol}</div>
                <div class="stock-values">
                    <div class="stock-current">₹${stock.price}</div>
                    <div class="stock-change ${changeClass}">
                        ${stock.change} (${stock.percentChange}%)
                    </div>
                    <div class="volume">Vol: ${stock.volume.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;
}

function updateUI(data) {
    // Update indices
    for (const [index, values] of Object.entries(data.indices)) {
        const priceId = index.toLowerCase().replace(' ', '') + 'Price';
        const changeId = index.toLowerCase().replace(' ', '') + 'Change';
        
        const priceElement = document.getElementById(priceId);
        const changeElement = document.getElementById(changeId);
        
        if (priceElement && changeElement) {
            priceElement.textContent = values.price;
            changeElement.textContent = `${values.change} (${values.percentChange}%)`;
            changeElement.className = `stock-change ${parseFloat(values.change) >= 0 ? 'positive' : 'negative'}`;
        }
    }

    // Update gainers and losers
    updateGainersLosers(data.stocks);
}

// Initialize everything
const simulator = new MarketDataSimulator();
simulator.subscribe(updateUI);
simulator.start();
const chart = initializeChart();

function updateMarketStatus() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();
    
    const marketStatus = document.getElementById('marketStatus');
    
    if (day >= 1 && day <= 5 && 
        ((hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || 
         (hours === 15 && minutes <= 30))) {
        marketStatus.textContent = 'Market Open';
    } else {
        marketStatus.textContent = 'Market Closed';
    }
}

setInterval(updateMarketStatus, 1000);
