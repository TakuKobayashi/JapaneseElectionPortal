import axios from 'axios';
import { Parliament, ParliamentType } from './interfaces/parliament';
import { PoliticalParty } from './interfaces/political-party';

const cheerio = require('cheerio');

export async function crawledFromPortal() {
  const $ = await loadAndParseHTMLfromCheerio('https://democracy.minibird.jp/');
  // 政党一覧
  const political_parties: Partial<PoliticalParty>[] = [];
  $('#party_links').each((i, party_links_in_elem) => {
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
  const parliaments: Partial<Parliament>[] = [];
  $('#syugi_in').each((i, syugi_in_elem) => {
    $(syugi_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j >= 1) {
          const infomations: Partial<Parliament> = {};
          infomations.parliament = ParliamentType[ParliamentType.Sangiin];
          $(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = $(cell_elem);
              switch (k) {
                case 1:
                  infomations.constituency = elem.find('span').remove().end().text();
                  break;
                case 2:
                  infomations.political_party_name = elem.text();
                  break;
                case 3:
                  infomations.parliamentary_group = elem.text();
                  break;
                case 4:
                  infomations.rubi_name = elem.find('.ruby').text();
                  infomations.win_count = Number(elem.find('.win').text());
                  infomations.name = elem.find('span').remove().end().text();
                  break;
                case 9:
                  infomations.parliament_house_phone_number = elem.text();
                  break;
                case 10:
                  infomations.parliament_house_fax_number = elem.text();
                  break;
                case 11:
                  const url_attr11 = $(elem.find('a')).attr() || {};
                  infomations.website_url = url_attr11.href;
                  break;
                case 12:
                  const url_attr12 = $(elem.find('a')).attr() || {};
                  infomations.twitter_url = url_attr12.href;
                  break;
                case 13:
                  const url_attr13 = $(elem.find('a')).attr() || {};
                  infomations.facebook_url = url_attr13.href;
                  break;
                case 14:
                  const addressStrings = elem.text().split(' ');
                  infomations.address = addressStrings[1];
                  infomations.place_name = addressStrings[2];
                  break;
                case 15:
                  infomations.local_phone_number = elem.text();
                  break;
                case 16:
                  infomations.local_fax_number = elem.text();
                  break;
                case 17:
                  const url_attr17 = $(elem.find('a')).attr() || {};
                  infomations.contact_url = url_attr17.href;
                  break;
                case 18:
                  const url_attr18 = $(elem.find('a')).attr() || {};
                  const mailAddressString = url_attr18.href || "";
                  infomations.mail_address = mailAddressString.replace("mailto:", "");
                  break;
                default:
                  break;
              }
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
  const parliaments: Partial<Parliament>[] = [];
  $('#sangi_in').each((i, sangi_in_elem) => {
    $(sangi_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j >= 1) {
          const infomations: Partial<Parliament> = {};
          infomations.parliament = ParliamentType[ParliamentType.Sangiin];
          $(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = $(cell_elem);
              switch (k) {
                case 1:
                  infomations.constituency = elem.find('span').remove().end().text();
                  break;
                case 2:
                  infomations.political_party_name = elem.text();
                  break;
                case 3:
                  infomations.parliamentary_group = elem.text();
                  break;
                case 4:
                  infomations.rubi_name = elem.find('.ruby').text();
                  infomations.win_count = Number(elem.find('.win').text());
                  infomations.name = elem.find('span').remove().end().text();
                  break;
                case 9:
                  infomations.parliament_house_phone_number = elem.text();
                  break;
                case 10:
                  infomations.parliament_house_fax_number = elem.text();
                  break;
                case 11:
                  const url_attr11 = $(elem.find('a')).attr() || {};
                  infomations.website_url = url_attr11.href;
                  break;
                case 12:
                  const url_attr12 = $(elem.find('a')).attr() || {};
                  infomations.twitter_url = url_attr12.href;
                  break;
                case 13:
                  const url_attr13 = $(elem.find('a')).attr() || {};
                  infomations.facebook_url = url_attr13.href;
                  break;
                case 14:
                  const addressStrings = elem.text().split(' ');
                  infomations.address = addressStrings[1];
                  infomations.place_name = addressStrings[2];
                  break;
                case 15:
                  infomations.local_phone_number = elem.text();
                  break;
                case 16:
                  infomations.local_fax_number = elem.text();
                  break;
                case 17:
                  const url_attr17 = $(elem.find('a')).attr() || {};
                  infomations.contact_url = url_attr17.href;
                  break;
                case 18:
                  const url_attr18 = $(elem.find('a')).attr() || {};
                  const mailAddressString = url_attr18.href || "";
                  infomations.mail_address = mailAddressString.replace("mailto:", "");
                  break;
                default:
                  break;
              }
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
