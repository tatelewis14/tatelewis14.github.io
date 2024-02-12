const search=document.getElementById('search')
const dropdown=document.getElementById('dropdown')
const selection = document.getElementById('search-category')
const form = document.getElementById('form')
const dataContainer = document.getElementById('data-container')
const api = "https://api.coinranking.com/v2/coins?";
const apiKey =
  "coinranking5be8a33da639de52f62d8bd9d85177b4a37dfb6dbcc6eb55";
async function getData(coin) { //Gets coin data based on search inputs
  let endpoint
  switch(selection.value) {
    case 'Name':
      endpoint=`search=${coin}`
      break;
    case 'UUID':
      endpoint = `uuids=${coin}`
      break;
    case 'symbol': 
      endpoint=`symbols=${coin}`
      break;
    default:
      endpoint=`limit=5`
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
      newDiv.addEventListener('click', e=> {
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

search.addEventListener('input', async e=>{
  if(search.value) {
    const coins = await autoComplete(search.value)
    showAutoComplete(coins)
    } else {
    return
  }
  if(!search.value) {
    dropdown.innerHTML = ''
  }
})

async function autoComplete(query) {
  const res = await fetch(`https://api.coinranking.com/v2/search-suggestions?query=${query}`)
  const json = await res.json()
  if(json.data&&json.data.coins) {
    return json.data.coins
  } else {
    return null
  }
}

function showAutoComplete(options) {
  let droption
  dropdown.innerHTML = ''
  options.forEach(option=> {
    switch(selection.value) {
      case 'Name': 
       droption = appendElement('p', 'option', option.name, dropdown)
    droption.addEventListener('click', e => {
      search.value = option.name
      try {
        renderData(option.name)
        console.log(`Autocomplete tried to render ${option.name}`)
      } catch (err) {
        console.log(`Error rendering autocomplete data: ${err}`)
      }
    })
    break;
    case 'UUID':
       droption = appendElement('p', 'option', option.uuid, dropdown)
    droption.addEventListener('click', e => {
      search.value = option.uuid
      try {
        renderData(option.uuid)
        console.log(`Autocomplete tried to render ${option.uuid}`)

      } catch (err) {
        console.log(`Error rendering autocomplete data: ${err}`)
      }
    })
    break;
    case 'Symbol':
     droption = appendElement('p', 'option', option.symbol, dropdown)
    droption.addEventListener('click', e => {
      search.value = option.symbol
      try {
        renderData(option.symbol)
        console.log(`Autocomplete tried to render ${option.symbol}`)

      } catch (err) {
        console.log(`Error rendering autocomplete data: ${err}`)
      }
    })
    }
    
})
if(!search.value) {
  dropdown.innerHTML=''
}
}
document.addEventListener('click', e => {
  if (!search.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.innerHTML = ''; 
  }
}) 