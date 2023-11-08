const cheerio = require("cheerio")
const axios = require("axios")

async function performScraping() {
  
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
        
        const houseType = $(element).find(".card-img").find(".badge").text().trim()
        // const houseLink = $(element).find(".card:nth-child(2)").attr("href")
        const title = $(element).find(".card-body").find(".card-title").text()
        const price = $(element).find(".card-body").find(".mb-2").text().trim()
        const totalArea = $(element).find(".card-footer").find(".FutureInfo").first().text().trim()
        const numberOfRooms = $(element).find(".card-footer").find(".FutureInfo:nth-child(2)").text().trim()
        const numberOfToilets = $(element).find(".card-footer").find(".FutureInfo:nth-child(3)").text().trim()
        
        const house = {
            houseType: houseType,
            // houseLink: houseLink,
            title: title,
            price: price,
            totalArea: totalArea,
            numberOfRooms: numberOfRooms,
            numberOfToilets: numberOfToilets
        }
        
        houses.push(house)
    })

    const showResult = houses.map((house)=>{
       return( `\n${house.title}\nCmimi: ${house.price}\nSiperfaqja: ${house.totalArea}\nNumri i dhomave: ${house.numberOfRooms}\nNumri i tualeteve: ${house.numberOfToilets}\n`
    )
    })
    console.log("\n_____Pronat_____\n",showResult.toString())
}


performScraping()
