const search=document.getElementById('search')
const form = document.getElementById('form')
const dataContainer = document.getElementById('data-container')
const api = "https://api.coinranking.com/v2/coins?";
const apiKey =
  "coinranking5be8a33da639de52f62d8bd9d85177b4a37dfb6dbcc6eb55";
async function getData(coin) { //Gets coin data based on search inputs
  let endpoint = 'limit=5'
  if(coin) {
    endpoint = `search=${coin}`
  }
  
  let response = await fetch(api+endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token":
        "coinranking5be8a33da639de52f62d8bd9d85177b4a37dfb6dbcc6eb55",
    },
  });
  let json = await response.json();
  if (json.status === "success") {
    console.log("Successfully retrieved data!");
    return json;
  } else {
    console.log("Retrieval failed!");
    return null;
  }
}

    async function renderData(coin) { //renders specific portions of the returned code
      unRender() // unrenders previous code
      const json = await getData(coin);
      let renderedCoins = []
      for (let coin of json.data.coins) {
      renderedCoins.push(' '+coin.name)
      let newDiv = appendElement('div', 'coin', coin.name)
      let price = appendElement('p', 'coin-info', `Price: $${Math.floor(coin.price)}`, newDiv)
      let volume = appendElement('p','hour-volume', `24 hour volume: ${coin['24hVolume']}`, newDiv)
      let newImg = appendElement('img', 'coin-img', coin.iconUrl, newDiv)
      newImg.width=100
      dataContainer.appendChild(newDiv);
      newDiv.appendChild(price)
      newDiv.appendChild(volume)
      newDiv.appendChild(newImg)
      newImg.addEventListener('click', e=> {
        let query = `coinName=${coin.name}&coinUUID=${coin.uuid}`
        window.location.href = `pages/chart.html?${query}`
      })
      
    }
    console.log(`Coins rendered:${renderedCoins}`)
  }
     const appendElement = (element, className, text, appendedTo) => {
      let lmnt;
      if (element) {
      lmnt = document.createElement(element)
      } else {
        console.log('Please provide an element.')
      } 
      if (className) {
        lmnt.classList.add(className)
        } else {
          console.log('Provide a class.')
        }
        if(appendedTo) {
          appendedTo.appendChild(lmnt)
        } else {
          console.log('Not appended')
        }
        if (element==='img'&&text) {
        lmnt.src = text
        } else if (text) {
          lmnt.innerText = text
        } else  {
          console.log('Please provide text')
        }
        if (element&&className) {
          return lmnt
        } else {
          return 'Provide all valid elements'
        }
       }

function unRender() {
  const coins = document.querySelectorAll('.coin')
  const img = document.querySelectorAll('.coin-img')
  const info = document.querySelectorAll('.coin-info')
  const hVolume = document.querySelectorAll('.hour-volume')

  console.log("Coins found:", coins.length);
  console.log("Images found:", img.length);
  console.log("Info elements found:", info.length);
  console.log("24-hour volume elements found:", hVolume.length);
  
  coins.forEach(coin=>coin.remove())
  img.forEach(image=>image.remove())
  info.forEach(inf=>inf.remove())
  hVolume.forEach(h=>h.remove())
  console.log('Data unrendered!')
}

form.addEventListener('submit', e =>{
  e.preventDefault()
  let coinQuery = search.value
  renderData(coinQuery)
  search.value=''
})
document.addEventListener('DOMContentLoaded', e => {
  renderData()
  console.log('Basic content loaded')
})
