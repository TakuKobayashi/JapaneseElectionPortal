import axios from 'axios';
import { Parliament, ParliamentType } from './interfaces/parliament';
import { PoliticalParty } from './interfaces/political-party';
import cheerio, { CheerioStatic } from 'cheerio';

export async function crawledFromPortal() {
  const democracyCheerio = await loadAndParseHTMLfromCheerio('https://democracy.minibird.jp/');
  // 政党一覧
  const political_parties: Partial<PoliticalParty>[] = [];
  democracyCheerio('#party_links').each((i, party_links_in_elem) => {
    democracyCheerio(party_links_in_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j >= 1) {
          const infomations: Partial<PoliticalParty> = {};
          democracyCheerio(row_elem)
            .find('td')
            .each((k, cell_elem) => {
              const elem = democracyCheerio(cell_elem);
              switch (k) {
                case 0:
                  infomations.id = elem.text();
                  break;
                case 1:
                  infomations.name = elem.find('span').remove().end().text();
                  const url_attr1 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.url = url_attr1.href;
                  break;
                case 2:
                  infomations.english_name = elem.text();
                  const url_attr2 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.english_url = url_attr2.href;
                  break;
                case 3:
                  const url_attr3 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.twitter_url = url_attr3.href;
                  break;
                case 4:
                  const url_attr4 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.facebook_url = url_attr4.href;
                  break;
                case 5:
                  const url_attr5 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.instagram_url = url_attr5.href;
                  break;
                case 6:
                  const url_attr6 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.youtube_url = url_attr6.href;
                  break;
                case 7:
                  const url_attr7 = democracyCheerio(elem.find('a')).attr() || {};
                  infomations.niconico_url = url_attr7.href;
                  break;
                case 8:
                  const url_attr8 = democracyCheerio(elem.find('a')).attr() || {};
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
  const parliaments = loadFromCouncillors(democracyCheerio, ParliamentType.Syugiin);
  const cheerioCouncillor = await loadAndParseHTMLfromCheerio('https://democracy.minibird.jp/councillors.php');
  for (const parliament of loadFromCouncillors(cheerioCouncillor, ParliamentType.Sangiin)) {
    parliaments.push(parliament);
  }
  return { political_parties, parliaments };
}

function loadFromCouncillors($: CheerioStatic, parliamentType: ParliamentType): Partial<Parliament>[] {
  const parliaments: Partial<Parliament>[] = [];
  const domString = parliamentType === ParliamentType.Syugiin ? '#syugi_in' : '#sangi_in';
  $(domString).each((i, table_elem) => {
    $(table_elem)
      .find('tr')
      .each((j, row_elem) => {
        if (j >= 1) {
          const infomations: Partial<Parliament> = {};
          infomations.parliament = ParliamentType[parliamentType];
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
                  const mailAddressString = url_attr18.href || '';
                  infomations.mail_address = mailAddressString.replace('mailto:', '');
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

async function loadAndParseHTMLfromCheerio(url: string): CheerioStatic {
  const response = await axios.get(url);
  return cheerio.load(response.data.normalize('NFKC'));
}
