import axios from 'axios';
import { Parliament } from './interfaces/parliament';
import { PoliticalParty } from './interfaces/political-party';

const cheerio = require('cheerio');

export async function crawledFromPortal() {
  const $ = await loadAndParseHTMLfromCheerio('https://democracy.minibird.jp/');
  // 政党一覧
  const political_parties: Partial<PoliticalParty>[] = [];
  $('#party_links').each((i, party_links_in_elem) => {
    const political_party_keys: Partial<PoliticalParty> = [];
    $(party_links_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j >= 1) {
          const infomations: Partial<PoliticalParty> = {};
          $(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = $(cell_elem);
              switch (k) {
                case 0:
                  infomations.id = elem.text();
                  break;
                case 1:
                  infomations.name = elem.find('span').remove().end().text();
                  const url_attr1 = $(elem.find('a')).attr() || {};
                  infomations.url = url_attr1.href;
                  break;
                case 2:
                  infomations.english_name = elem.text();
                  const url_attr2 = $(elem.find('a')).attr() || {};
                  infomations.english_url = url_attr2.href;
                  break;
                case 3:
                  const url_attr3 = $(elem.find('a')).attr() || {};
                  infomations.twitter_url = url_attr3.href;
                  break;
                case 4:
                  const url_attr4 = $(elem.find('a')).attr() || {};
                  infomations.facebook_url = url_attr4.href;
                  break;
                case 5:
                  const url_attr5 = $(elem.find('a')).attr() || {};
                  infomations.instagram_url = url_attr5.href;
                  break;
                case 6:
                  const url_attr6 = $(elem.find('a')).attr() || {};
                  infomations.youtube_url = url_attr6.href;
                  break;
                case 7:
                  const url_attr7 = $(elem.find('a')).attr() || {};
                  infomations.niconico_url = url_attr7.href;
                  break;
                case 8:
                  const url_attr8 = $(elem.find('a')).attr() || {};
                  infomations.contact_url = url_attr8.href;
                  break;
                default:
                  break;
              }
            });
          political_parties.push(infomations);
        }
      });
  });
  const parliaments = [];
  $('#syugi_in').each((i, syugi_in_elem) => {
    $(syugi_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j > 0) {
          const infomations = {};
          //console.log($(row_elem).text());
          $(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = $(cell_elem);
              infomations[elem.attr().class] = elem.text();
            });
          parliaments.push(infomations);
        }
      });
  });
  for (const parliament of await loadFromCouncillors()) {
    parliaments.push(parliament);
  }
  return { political_parties, parliaments };
}

async function loadFromCouncillors() {
  const $ = await loadAndParseHTMLfromCheerio('https://democracy.minibird.jp/councillors.php');
  const parliaments = [];
  $('#sangi_in').each((i, sangi_in_elem) => {
    $(sangi_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j > 0) {
          const infomations = {};
          //console.log($(row_elem).text());
          $(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = $(cell_elem);
              infomations[elem.attr().class] = elem.text();
            });
          parliaments.push(infomations);
        }
      });
  });
  return parliaments;
}

async function loadAndParseHTMLfromCheerio(url: string) {
  const response = await axios.get(url);
  return cheerio.load(response.data);
}
