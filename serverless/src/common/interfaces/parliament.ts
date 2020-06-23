export interface Parliament {
  name: string;
  rubi_name: string;
  win_count: number;
  parliamentType: ParliamentType;
  website_url: string;
  postal_code: string;
  address: string;
  place_name: string;
  constituency: string;
  local_phone_number: string;
  local_fax_number: string;
  political_party_name: string;
  parliamentary_group: string;
  parliament_house_phone_number: string;
  parliament_house_fax_number: string;
  twitter_url: string;
  facebook_url: string;
  contact_url: string;
  mail_address: string;
}

export enum ParliamentType {
  Syugiin,
  Sangiin,
}
