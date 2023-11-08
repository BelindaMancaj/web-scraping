const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.century21albania.com/property/3100962/magazine-me-qira-lagjia-pavaresia-vlore-abitat82451.html';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('.card-body').find("p").text();
    console.log('Page Title:', title);

  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
