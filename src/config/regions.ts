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
  latitude: number;
  longitude: number;
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
  latitude: number,
  longitude: number,
): ProvinceDefinition => ({ isoCode, slug, nameTh, nameEn, regionId, latitude, longitude });

export const PROVINCES: readonly ProvinceDefinition[] = [
  // ภาคเหนือ
  province('TH-50', 'chiang-mai', 'เชียงใหม่', 'Chiang Mai', 'north', 18.7883, 98.9853),
  province('TH-57', 'chiang-rai', 'เชียงราย', 'Chiang Rai', 'north', 19.9105, 99.8406),
  province('TH-51', 'lamphun', 'ลำพูน', 'Lamphun', 'north', 18.5745, 99.0087),
  province('TH-52', 'lampang', 'ลำปาง', 'Lampang', 'north', 18.2888, 99.4928),
  province('TH-58', 'mae-hong-son', 'แม่ฮ่องสอน', 'Mae Hong Son', 'north', 19.3021, 97.9654),
  province('TH-55', 'nan', 'น่าน', 'Nan', 'north', 18.7756, 100.7730),
  province('TH-56', 'phayao', 'พะเยา', 'Phayao', 'north', 19.1664, 99.9022),
  province('TH-54', 'phrae', 'แพร่', 'Phrae', 'north', 18.1446, 100.1410),
  province('TH-53', 'uttaradit', 'อุตรดิตถ์', 'Uttaradit', 'north', 17.6201, 100.0993),
  province('TH-63', 'tak', 'ตาก', 'Tak', 'north', 16.8839, 99.1258),
  province('TH-64', 'sukhothai', 'สุโขทัย', 'Sukhothai', 'north', 17.0078, 99.8234),
  province('TH-65', 'phitsanulok', 'พิษณุโลก', 'Phitsanulok', 'north', 16.8211, 100.2659),
  province('TH-66', 'phichit', 'พิจิตร', 'Phichit', 'north', 16.4429, 100.3488),
  province('TH-62', 'kamphaeng-phet', 'กำแพงเพชร', 'Kamphaeng Phet', 'north', 16.4828, 99.5227),
  province('TH-67', 'phetchabun', 'เพชรบูรณ์', 'Phetchabun', 'north', 16.4190, 101.1567),
  province('TH-60', 'nakhon-sawan', 'นครสวรรค์', 'Nakhon Sawan', 'north', 15.7057, 100.1378),
  province('TH-61', 'uthai-thani', 'อุทัยธานี', 'Uthai Thani', 'north', 15.3835, 100.0246),

  // ภาคตะวันออกเฉียงเหนือ (อีสาน)
  province('TH-46', 'kalasin', 'กาฬสินธุ์', 'Kalasin', 'northeast', 16.4322, 103.5063),
  province('TH-40', 'khon-kaen', 'ขอนแก่น', 'Khon Kaen', 'northeast', 16.4322, 102.8236),
  province('TH-36', 'chaiyaphum', 'ชัยภูมิ', 'Chaiyaphum', 'northeast', 15.8105, 102.0315),
  province('TH-48', 'nakhon-phanom', 'นครพนม', 'Nakhon Phanom', 'northeast', 17.3998, 104.7787),
  province('TH-30', 'nakhon-ratchasima', 'นครราชสีมา', 'Nakhon Ratchasima', 'northeast', 14.9799, 102.0978),
  province('TH-38', 'bueng-kan', 'บึงกาฬ', 'Bueng Kan', 'northeast', 18.3609, 103.6465),
  province('TH-31', 'buri-ram', 'บุรีรัมย์', 'Buri Ram', 'northeast', 14.9930, 103.1029),
  province('TH-44', 'maha-sarakham', 'มหาสารคาม', 'Maha Sarakham', 'northeast', 16.1852, 103.3007),
  province('TH-49', 'mukdahan', 'มุกดาหาร', 'Mukdahan', 'northeast', 16.5436, 104.7235),
  province('TH-35', 'yasothon', 'ยโสธร', 'Yasothon', 'northeast', 15.7926, 104.1453),
  province('TH-45', 'roi-et', 'ร้อยเอ็ด', 'Roi Et', 'northeast', 16.0538, 103.6520),
  province('TH-42', 'loei', 'เลย', 'Loei', 'northeast', 17.4860, 101.7223),
  province('TH-33', 'si-sa-ket', 'ศรีสะเกษ', 'Si Sa Ket', 'northeast', 15.1186, 104.3220),
  province('TH-47', 'sakon-nakhon', 'สกลนคร', 'Sakon Nakhon', 'northeast', 17.1612, 104.1486),
  province('TH-32', 'surin', 'สุรินทร์', 'Surin', 'northeast', 14.8829, 103.4936),
  province('TH-43', 'nong-khai', 'หนองคาย', 'Nong Khai', 'northeast', 17.8783, 102.7420),
  province('TH-39', 'nong-bua-lam-phu', 'หนองบัวลำภู', 'Nong Bua Lam Phu', 'northeast', 17.2037, 102.4407),
  province('TH-37', 'amnat-charoen', 'อำนาจเจริญ', 'Amnat Charoen', 'northeast', 15.8585, 104.6258),
  province('TH-41', 'udon-thani', 'อุดรธานี', 'Udon Thani', 'northeast', 17.4157, 102.7859),
  province('TH-34', 'ubon-ratchathani', 'อุบลราชธานี', 'Ubon Ratchathani', 'northeast', 15.2449, 104.8473),

  // ภาคกลาง
  province('TH-10', 'bangkok', 'กรุงเทพมหานคร', 'Bangkok', 'central', 13.7563, 100.5018),
  province('TH-11', 'samut-prakan', 'สมุทรปราการ', 'Samut Prakan', 'central', 13.5991, 100.5998),
  province('TH-12', 'nonthaburi', 'นนทบุรี', 'Nonthaburi', 'central', 13.8621, 100.5144),
  province('TH-13', 'pathum-thani', 'ปทุมธานี', 'Pathum Thani', 'central', 14.0208, 100.5250),
  province('TH-14', 'phra-nakhon-si-ayutthaya', 'พระนครศรีอยุธยา', 'Phra Nakhon Si Ayutthaya', 'central', 14.3532, 100.5684),
  province('TH-15', 'ang-thong', 'อ่างทอง', 'Ang Thong', 'central', 14.5896, 100.4550),
  province('TH-16', 'lop-buri', 'ลพบุรี', 'Lop Buri', 'central', 14.7995, 100.6534),
  province('TH-17', 'sing-buri', 'สิงห์บุรี', 'Sing Buri', 'central', 14.8911, 100.4048),
  province('TH-18', 'chai-nat', 'ชัยนาท', 'Chai Nat', 'central', 15.1852, 100.1252),
  province('TH-19', 'saraburi', 'สระบุรี', 'Saraburi', 'central', 14.5289, 100.9108),
  province('TH-26', 'nakhon-nayok', 'นครนายก', 'Nakhon Nayok', 'central', 14.2069, 101.2131),
  province('TH-72', 'suphan-buri', 'สุพรรณบุรี', 'Suphan Buri', 'central', 14.4745, 100.1177),
  province('TH-73', 'nakhon-pathom', 'นครปฐม', 'Nakhon Pathom', 'central', 13.8196, 100.0601),
  province('TH-74', 'samut-sakhon', 'สมุทรสาคร', 'Samut Sakhon', 'central', 13.5475, 100.2744),
  province('TH-75', 'samut-songkhram', 'สมุทรสงคราม', 'Samut Songkhram', 'central', 13.4098, 99.9968),

  // ภาคตะวันออก
  province('TH-24', 'chachoengsao', 'ฉะเชิงเทรา', 'Chachoengsao', 'east', 13.6904, 101.0780),
  province('TH-20', 'chon-buri', 'ชลบุรี', 'Chon Buri', 'east', 13.3611, 100.9847),
  province('TH-21', 'rayong', 'ระยอง', 'Rayong', 'east', 12.6814, 101.2816),
  province('TH-22', 'chanthaburi', 'จันทบุรี', 'Chanthaburi', 'east', 12.6114, 102.1039),
  province('TH-23', 'trat', 'ตราด', 'Trat', 'east', 12.2428, 102.5175),
  province('TH-25', 'prachin-buri', 'ปราจีนบุรี', 'Prachin Buri', 'east', 14.0510, 101.3716),
  province('TH-27', 'sa-kaeo', 'สระแก้ว', 'Sa Kaeo', 'east', 13.8140, 102.0718),

  // ภาคตะวันตก
  province('TH-71', 'kanchanaburi', 'กาญจนบุรี', 'Kanchanaburi', 'west', 14.0228, 99.5328),
  province('TH-70', 'ratchaburi', 'ราชบุรี', 'Ratchaburi', 'west', 13.5283, 99.8134),
  province('TH-76', 'phetchaburi', 'เพชรบุรี', 'Phetchaburi', 'west', 13.1114, 99.9391),
  province('TH-77', 'prachuap-khiri-khan', 'ประจวบคีรีขันธ์', 'Prachuap Khiri Khan', 'west', 11.8124, 99.7973),

  // ภาคใต้
  province('TH-86', 'chumphon', 'ชุมพร', 'Chumphon', 'south', 10.4930, 99.1800),
  province('TH-85', 'ranong', 'ระนอง', 'Ranong', 'south', 9.9658, 98.6348),
  province('TH-84', 'surat-thani', 'สุราษฎร์ธานี', 'Surat Thani', 'south', 9.1382, 99.3215),
  province('TH-82', 'phang-nga', 'พังงา', 'Phang Nga', 'south', 8.4501, 98.5255),
  province('TH-83', 'phuket', 'ภูเก็ต', 'Phuket', 'south', 7.8804, 98.3923),
  province('TH-81', 'krabi', 'กระบี่', 'Krabi', 'south', 8.0863, 98.9063),
  province('TH-80', 'nakhon-si-thammarat', 'นครศรีธรรมราช', 'Nakhon Si Thammarat', 'south', 8.4304, 99.9631),
  province('TH-92', 'trang', 'ตรัง', 'Trang', 'south', 7.5563, 99.6114),
  province('TH-93', 'phatthalung', 'พัทลุง', 'Phatthalung', 'south', 7.6167, 100.0740),
  province('TH-91', 'satun', 'สตูล', 'Satun', 'south', 6.6238, 100.0674),
  province('TH-90', 'songkhla', 'สงขลา', 'Songkhla', 'south', 7.1756, 100.6143),
  province('TH-94', 'pattani', 'ปัตตานี', 'Pattani', 'south', 6.8675, 101.2501),
  province('TH-95', 'yala', 'ยะลา', 'Yala', 'south', 6.5411, 101.2804),
  province('TH-96', 'narathiwat', 'นราธิวาส', 'Narathiwat', 'south', 6.4255, 101.8253),
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
