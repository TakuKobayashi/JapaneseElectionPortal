import axios from 'axios';

const cheerio = require('cheerio');

export async function crawledFromPortal() {
  const response = await axios.get("https://democracy.minibird.jp/")
  const $ = cheerio.load(response.data);
  const parliaments = [];
  $("#syugi_in").each((i, syugi_in_elem) => {
    $(syugi_in_elem).find("tr").each((j, row_elem) => {
      if(j > 0){
        const infomations = {}
        //console.log($(row_elem).text());
        $(row_elem).find("td").each((k, cell_elem) => {
          const elem = $(cell_elem);
          infomations[elem.attr().class] = elem.text()
        });
        parliaments.push(infomations);
      }
    });
  })
  return parliaments;
}