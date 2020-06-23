import axios from 'axios';

const cheerio = require('cheerio');

export async function crawledFromPortal() {
  const response = await axios.get("https://democracy.minibird.jp/")
  const $ = cheerio.load(response.data);
  const political_parties = [];
  $("#party_links").each((i, party_links_in_elem) => {
    const political_party_keys = [];
    $(party_links_in_elem).find("tr").each((j, row_elem) => {
      if(j == 0){
        $(row_elem).find("th").each((k, cell_elem) => {
          political_party_keys.push($(cell_elem).attr().class);
        });
      console.log(political_party_keys);
      }else{
        const infomations = {}
        //console.log($(row_elem).text());
        $(row_elem).find("td").each((k, cell_elem) => {
          const elem = $(cell_elem);
          infomations[political_party_keys[k]] = elem.text()
        });
        political_parties.push(infomations);
      }
    });
  })
  const parliaments = [];
  $("#syugi_in").each((i, syugin_in_elem) => {
    $(syugin_in_elem).find("tr").each((j, row_elem) => {
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
  return {political_parties, parliaments};
}