export type RegionId =
  | 'north'
  | 'northeast'
  | 'central'
  | 'east'
  | 'west'
  | 'south';

export interface ProvinceDefinition {
  isoCode: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  regionId: RegionId;
}

export interface RegionDefinition {
  id: RegionId;
  shortLabel: string;
  nameTh: string;
  nameEn: string;
  provinceIsoCodes: readonly string[];
}

const province = (
  isoCode: string,
  slug: string,
  nameTh: string,
  nameEn: string,
  regionId: RegionId,
): ProvinceDefinition => ({ isoCode, slug, nameTh, nameEn, regionId });

export const PROVINCES: readonly ProvinceDefinition[] = [
  province('TH-50', 'chiang-mai', 'เชียงใหม่', 'Chiang Mai', 'north'),
  province('TH-57', 'chiang-rai', 'เชียงราย', 'Chiang Rai', 'north'),
  province('TH-51', 'lamphun', 'ลำพูน', 'Lamphun', 'north'),
  province('TH-52', 'lampang', 'ลำปาง', 'Lampang', 'north'),
  province('TH-58', 'mae-hong-son', 'แม่ฮ่องสอน', 'Mae Hong Son', 'north'),
  province('TH-55', 'nan', 'น่าน', 'Nan', 'north'),
  province('TH-56', 'phayao', 'พะเยา', 'Phayao', 'north'),
  province('TH-54', 'phrae', 'แพร่', 'Phrae', 'north'),
  province('TH-53', 'uttaradit', 'อุตรดิตถ์', 'Uttaradit', 'north'),
  province('TH-63', 'tak', 'ตาก', 'Tak', 'north'),
  province('TH-64', 'sukhothai', 'สุโขทัย', 'Sukhothai', 'north'),
  province('TH-65', 'phitsanulok', 'พิษณุโลก', 'Phitsanulok', 'north'),
  province('TH-66', 'phichit', 'พิจิตร', 'Phichit', 'north'),
  province('TH-62', 'kamphaeng-phet', 'กำแพงเพชร', 'Kamphaeng Phet', 'north'),
  province('TH-67', 'phetchabun', 'เพชรบูรณ์', 'Phetchabun', 'north'),
  province('TH-60', 'nakhon-sawan', 'นครสวรรค์', 'Nakhon Sawan', 'north'),
  province('TH-61', 'uthai-thani', 'อุทัยธานี', 'Uthai Thani', 'north'),
  province('TH-46', 'kalasin', 'กาฬสินธุ์', 'Kalasin', 'northeast'),
  province('TH-40', 'khon-kaen', 'ขอนแก่น', 'Khon Kaen', 'northeast'),
  province('TH-36', 'chaiyaphum', 'ชัยภูมิ', 'Chaiyaphum', 'northeast'),
  province('TH-48', 'nakhon-phanom', 'นครพนม', 'Nakhon Phanom', 'northeast'),
  province('TH-30', 'nakhon-ratchasima', 'นครราชสีมา', 'Nakhon Ratchasima', 'northeast'),
  province('TH-38', 'bueng-kan', 'บึงกาฬ', 'Bueng Kan', 'northeast'),
  province('TH-31', 'buri-ram', 'บุรีรัมย์', 'Buri Ram', 'northeast'),
  province('TH-44', 'maha-sarakham', 'มหาสารคาม', 'Maha Sarakham', 'northeast'),
  province('TH-49', 'mukdahan', 'มุกดาหาร', 'Mukdahan', 'northeast'),
  province('TH-35', 'yasothon', 'ยโสธร', 'Yasothon', 'northeast'),
  province('TH-45', 'roi-et', 'ร้อยเอ็ด', 'Roi Et', 'northeast'),
  province('TH-42', 'loei', 'เลย', 'Loei', 'northeast'),
  province('TH-33', 'si-sa-ket', 'ศรีสะเกษ', 'Si Sa Ket', 'northeast'),
  province('TH-47', 'sakon-nakhon', 'สกลนคร', 'Sakon Nakhon', 'northeast'),
  province('TH-32', 'surin', 'สุรินทร์', 'Surin', 'northeast'),
  province('TH-43', 'nong-khai', 'หนองคาย', 'Nong Khai', 'northeast'),
  province('TH-39', 'nong-bua-lam-phu', 'หนองบัวลำภู', 'Nong Bua Lam Phu', 'northeast'),
  province('TH-37', 'amnat-charoen', 'อำนาจเจริญ', 'Amnat Charoen', 'northeast'),
  province('TH-41', 'udon-thani', 'อุดรธานี', 'Udon Thani', 'northeast'),
  province('TH-34', 'ubon-ratchathani', 'อุบลราชธานี', 'Ubon Ratchathani', 'northeast'),
  province('TH-10', 'bangkok', 'กรุงเทพมหานคร', 'Bangkok', 'central'),
  province('TH-11', 'samut-prakan', 'สมุทรปราการ', 'Samut Prakan', 'central'),
  province('TH-12', 'nonthaburi', 'นนทบุรี', 'Nonthaburi', 'central'),
  province('TH-13', 'pathum-thani', 'ปทุมธานี', 'Pathum Thani', 'central'),
  province('TH-14', 'phra-nakhon-si-ayutthaya', 'พระนครศรีอยุธยา', 'Phra Nakhon Si Ayutthaya', 'central'),
  province('TH-15', 'ang-thong', 'อ่างทอง', 'Ang Thong', 'central'),
  province('TH-16', 'lop-buri', 'ลพบุรี', 'Lop Buri', 'central'),
  province('TH-17', 'sing-buri', 'สิงห์บุรี', 'Sing Buri', 'central'),
  province('TH-18', 'chai-nat', 'ชัยนาท', 'Chai Nat', 'central'),
  province('TH-19', 'saraburi', 'สระบุรี', 'Saraburi', 'central'),
  province('TH-26', 'nakhon-nayok', 'นครนายก', 'Nakhon Nayok', 'central'),
  province('TH-72', 'suphan-buri', 'สุพรรณบุรี', 'Suphan Buri', 'central'),
  province('TH-73', 'nakhon-pathom', 'นครปฐม', 'Nakhon Pathom', 'central'),
  province('TH-74', 'samut-sakhon', 'สมุทรสาคร', 'Samut Sakhon', 'central'),
  province('TH-75', 'samut-songkhram', 'สมุทรสงคราม', 'Samut Songkhram', 'central'),
  province('TH-24', 'chachoengsao', 'ฉะเชิงเทรา', 'Chachoengsao', 'east'),
  province('TH-20', 'chon-buri', 'ชลบุรี', 'Chon Buri', 'east'),
  province('TH-21', 'rayong', 'ระยอง', 'Rayong', 'east'),
  province('TH-22', 'chanthaburi', 'จันทบุรี', 'Chanthaburi', 'east'),
  province('TH-23', 'trat', 'ตราด', 'Trat', 'east'),
  province('TH-25', 'prachin-buri', 'ปราจีนบุรี', 'Prachin Buri', 'east'),
  province('TH-27', 'sa-kaeo', 'สระแก้ว', 'Sa Kaeo', 'east'),
  province('TH-71', 'kanchanaburi', 'กาญจนบุรี', 'Kanchanaburi', 'west'),
  province('TH-70', 'ratchaburi', 'ราชบุรี', 'Ratchaburi', 'west'),
  province('TH-76', 'phetchaburi', 'เพชรบุรี', 'Phetchaburi', 'west'),
  province('TH-77', 'prachuap-khiri-khan', 'ประจวบคีรีขันธ์', 'Prachuap Khiri Khan', 'west'),
  province('TH-86', 'chumphon', 'ชุมพร', 'Chumphon', 'south'),
  province('TH-85', 'ranong', 'ระนอง', 'Ranong', 'south'),
  province('TH-84', 'surat-thani', 'สุราษฎร์ธานี', 'Surat Thani', 'south'),
  province('TH-82', 'phang-nga', 'พังงา', 'Phang Nga', 'south'),
  province('TH-83', 'phuket', 'ภูเก็ต', 'Phuket', 'south'),
  province('TH-81', 'krabi', 'กระบี่', 'Krabi', 'south'),
  province('TH-80', 'nakhon-si-thammarat', 'นครศรีธรรมราช', 'Nakhon Si Thammarat', 'south'),
  province('TH-92', 'trang', 'ตรัง', 'Trang', 'south'),
  province('TH-93', 'phatthalung', 'พัทลุง', 'Phatthalung', 'south'),
  province('TH-91', 'satun', 'สตูล', 'Satun', 'south'),
  province('TH-90', 'songkhla', 'สงขลา', 'Songkhla', 'south'),
  province('TH-94', 'pattani', 'ปัตตานี', 'Pattani', 'south'),
  province('TH-95', 'yala', 'ยะลา', 'Yala', 'south'),
  province('TH-96', 'narathiwat', 'นราธิวาส', 'Narathiwat', 'south'),
] as const;

const provinceCodesFor = (regionId: RegionId) =>
  PROVINCES.filter((item) => item.regionId === regionId).map(
    (item) => item.isoCode,
  );

export const REGIONS: readonly RegionDefinition[] = [
  { id: 'north', shortLabel: 'เหนือ', nameTh: 'ภาคเหนือ', nameEn: 'Northern', provinceIsoCodes: provinceCodesFor('north') },
  { id: 'northeast', shortLabel: 'อีสาน', nameTh: 'ภาคตะวันออกเฉียงเหนือ', nameEn: 'Northeastern', provinceIsoCodes: provinceCodesFor('northeast') },
  { id: 'central', shortLabel: 'กลาง', nameTh: 'ภาคกลาง', nameEn: 'Central', provinceIsoCodes: provinceCodesFor('central') },
  { id: 'east', shortLabel: 'ตะวันออก', nameTh: 'ภาคตะวันออก', nameEn: 'Eastern', provinceIsoCodes: provinceCodesFor('east') },
  { id: 'west', shortLabel: 'ตะวันตก', nameTh: 'ภาคตะวันตก', nameEn: 'Western', provinceIsoCodes: provinceCodesFor('west') },
  { id: 'south', shortLabel: 'ใต้', nameTh: 'ภาคใต้', nameEn: 'Southern', provinceIsoCodes: provinceCodesFor('south') },
] as const;

export const BANGKOK_METRO_PROVINCE_CODES = [
  'TH-10',
  'TH-11',
  'TH-12',
  'TH-13',
  'TH-73',
  'TH-74',
] as const;

export const PROVINCE_BY_ISO = new Map(PROVINCES.map((item) => [item.isoCode, item]));
export const PROVINCE_BY_SLUG = new Map(PROVINCES.map((item) => [item.slug, item]));
export const REGION_BY_ID = new Map(REGIONS.map((item) => [item.id, item]));
