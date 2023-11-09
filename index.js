const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("fs");

const performScraping = async () => {
  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://www.century21albania.com/properties",
  });

  const $ = cheerio.load(axiosResponse.data);

  const maxPages = $(".pagination li:nth-last-child(2)").find("a").text();

  const links = await getAllPropertyLinks(maxPages);

  const properties = [];

  for (const link of links) {
    const data = await getPropertyDetails(link);

    properties.push(data);
  }

  try {
    fs.writeFileSync("file.json", JSON.stringify(properties));
    console.log("File has been saved.");
  } catch (error) {
    console.error(error);
  }
};

const getAllPropertyLinks = async (pages) => {
  const links = [];

  for (let i = 1; i <= pages; i++) {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://www.century21albania.com/properties?page=${i}`,
    });

    const $ = cheerio.load(axiosResponse.data);

    $(".osahan_top_filter")
      .find(".property")
      .each((index, element) => {
        const link = $(element).find("a:eq(1)").attr("href"); //.text();

        links.push(link);
      });
  }

  return links;
};

const getPropertyDetails = async (link) => {
  const axiosResponse = await axios.request({
    method: "GET",
    url: link,
  });

  const $ = cheerio.load(axiosResponse.data);

  const header = $(".osahan-slider")
    .find(".property-single-title")
    .find(".row");

  const title = header.find("h1").text().trim();
  const location = header.find("h6:eq(0)").text().trim();
  const status = header.find("h6:eq(1)").text().trim();
  const price = header.find("h2.text-primary").text().trim();
  const description = $("div.card-body:eq(1)").find("p:eq(0)").text().trim();
  const properties = [];

  $("div.card-body:eq(2)")
    .find(".row")
    .find("div")
    .each((_, element) => {
      const desc = $(element)
        .find("div.list-icon")
        .find("strong")
        .text()
        .trim();

      const value = $(element).find("div.list-icon").find("p").text().trim();

      if (desc && value) {
        properties.push(`${desc} ${value}`);
      }
    });

  return {
    title,
    location,
    status,
    price,
    description,
    properties,
  };
};

performScraping();
