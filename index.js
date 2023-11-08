const cheerio = require("cheerio")
const axios = require("axios")

async function performScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.century21albania.com/properties",
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(axiosResponse.data)
    const houses = [];

   $(".osahan_top_filter").find(".property").each((index, element) => {
        
        const title = $(element).find(".card-body").find(".card-title").text()
        const price = $(element).find(".card-body").find(".mb-2").text().trim()
        const measures = $(element).find(".card-footer").find(".FutureInfo").text().trim()
        
        const house = {
            title: title,
            price: price
        }
        
        houses.push(measures)
    })
    console.log(houses)
}

performScraping()