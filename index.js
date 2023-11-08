
const cheerio = require('cheerio');
const axios = require('axios');
 
const performScraping = async () => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: 'https://www.century21albania.com/properties'
  });
 
  const $ = cheerio.load(axiosResponse.data);
 
  const maxPages = $('.pagination li:nth-last-child(2)').find('a').text();
 
  const links = await getAllPropertyLinks(2);
 
  console.log(links);
};
 
performScraping();
 
const getAllPropertyLinks = async (pages) => {
  const links = [];
 
  for (let i = 1; i <= pages; i++) {
    const axiosResponse = await axios.request({
      method: 'GET',
      url: `https://www.century21albania.com/properties?page=${i}`
    });
 
    const $ = cheerio.load(axiosResponse.data);
 
    $('.osahan_top_filter')
      .find('.property')
      .each((index, element) => {
        const link = $(element).find('a:eq(1)').attr('href').each((i, info)=>{
            const houseInfo = $('.card-body').find("p").text()
            links.push(houseInfo);
        }); //.text();
 
      });
  }
 
  return links;
};