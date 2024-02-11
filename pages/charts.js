document.addEventListener('DOMContentLoaded', e=>{
const queryString = window.location.search
const params = new URLSearchParams(queryString)
const coinName = params.get('coinName')
const UUID = params.get('coinUUID')
const api = 'https://api.coinranking.com/v2/coins'

const getData = async () => {
    let endpoint
    if(UUID) {
        endpoint = `?uuids=${UUID}`
        console.log('Calling data by UUID')
    } else if(coinName) {
        endpoint = `?search=${coinName}`
        console.log('Calling data by coin name')
    }
    const res = await fetch(api+endpoint, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "x-access-token":
            "coinranking5be8a33da639de52f62d8bd9d85177b4a37dfb6dbcc6eb55",
        }
    })
    if(res.ok) {
        console.log('Successfully called data!')
        const json = await res.json()
        const sparkData = json.data.coins[0].sparkline
        console.log(sparkData)
        return sparkData
    } else {
        console.log('Failed to fetch data!')
        console.log(await res.message)
        return null
    }
}

let context = document.getElementById('canvas').getContext('2d')
if(!context) {
    console.log('Canvas with an ID of canvas not found')
}


getData()
.then(sparkData => {
    new Chart(context, {
        type: 'line',
        data: {
            labels: ['24 Hours Ago', '18 Hours Ago', '12 Hours Ago', '6 Hours Ago', 'Now'],
            datasets: [{
                label: `${coinName} Price`,
                data: sparkData,
                borderWidth: 2,
                borderColor: '#7289da',
                backgroundColor: 'rgba(114, 137, 218, 0.1)',
                pointRadius: 0,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12,
                            family: 'Arial',
                        }
                    }
                },
                x: {
                    beginAtZero: false,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 12,
                            family: 'Arial',
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            size: 14,
                            family: 'Arial',
                        }
                    }
                }
            }
        }
    });
    
    console.log(`Data graphed for ${coinName}: ${sparkData}`)
})
.catch(err => {
    console.log('Error rendering data: ' + err)
})


})