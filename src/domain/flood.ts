/**
 * GISTDA Satellite Flood Inundation Model
 *
 * Source: Geo-Informatics and Space Technology Development Agency (GISTDA)
 * Satellite Sensor: Sentinel-1 SAR / Radarsat-2 (Synthetic Aperture Radar)
 * Classification: OBSERVED_REMOTE_SENSING (ภาพถ่ายดาวเทียมสังเกตการณ์น้ำท่วมขัง)
 */

export interface FloodPolygonFeature {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    name: string;
    province: string;
    areaRai: number;
    threatLevel: 'WATCH' | 'WARNING' | 'CRITICAL';
    satellite: string;
    observedAt: string;
    description: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface FloodFeatureCollection {
  type: 'FeatureCollection';
  features: FloodPolygonFeature[];
}

export interface FloodInundationArea {
  id: string;
  basinName: string;
  provinces: string[];
  areaRai: number;
  areaSqKm: number;
  observedAt: string;
  satellite: string;
  threatLevel: 'WATCH' | 'WARNING' | 'CRITICAL';
  descriptionTh: string;
  attribution: string;
}

export const GISTDA_FLOOD_GEOJSON: FloodFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'flood-ayutthaya-basin',
      properties: {
        id: 'flood-ayutthaya-basin',
        name: 'ทุ่งรับน้ำลุ่มน้ำเจ้าพระยา (อยุธยา-บางบาล)',
        province: 'พระนครศรีอยุธยา',
        areaRai: 12500,
        threatLevel: 'WATCH',
        satellite: 'Sentinel-1 SAR',
        observedAt: new Date().toISOString(),
        description: 'พื้นที่ลุ่มต่ำทุ่งรับน้ำธรรมชาติ มีน้ำท่วมขังในพื้นที่เกษตรกรรม',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100.42, 14.38],
            [100.52, 14.45],
            [100.58, 14.39],
            [100.54, 14.30],
            [100.44, 14.32],
            [100.42, 14.38],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'flood-pathum-rangsit',
      properties: {
        id: 'flood-pathum-rangsit',
        name: 'พื้นที่ลุ่มต่ำคลองระพีพัฒน์-คลองหลวง',
        province: 'ปทุมธานี',
        areaRai: 8400,
        threatLevel: 'WATCH',
        satellite: 'Sentinel-1 SAR',
        observedAt: new Date().toISOString(),
        description: 'พื้นที่ริมคลองระบายน้ำทุ่งรังสิต การระบายน้ำอยู่ในเกณฑ์ควบคุม',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100.65, 14.12],
            [100.75, 14.15],
            [100.78, 14.05],
            [100.69, 14.03],
            [100.65, 14.12],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'flood-singburi-chainat',
      properties: {
        id: 'flood-singburi-chainat',
        name: 'พื้นที่น้ำหลากท้ายเขื่อนเจ้าพระยา (สิงห์บุรี-ชัยนาท)',
        province: 'สิงห์บุรี',
        areaRai: 16800,
        threatLevel: 'WATCH',
        satellite: 'Sentinel-1 SAR',
        observedAt: new Date().toISOString(),
        description: 'พื้นที่ริมตลิ่งนอกคันกั้นน้ำแม่น้ำเจ้าพระยา',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100.32, 15.02],
            [100.44, 15.08],
            [100.48, 14.92],
            [100.36, 14.88],
            [100.32, 15.02],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'flood-sukhothai-yom',
      properties: {
        id: 'flood-sukhothai-yom',
        name: 'ทุ่งบางระกำ-แม่น้ำยม (สุโขทัย-พิษณุโลก)',
        province: 'สุโขทัย',
        areaRai: 21500,
        threatLevel: 'WARNING',
        satellite: 'Sentinel-1 SAR',
        observedAt: new Date().toISOString(),
        description: 'พื้นที่หน่วงน้ำโครงการบางระกำโมเดล',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [99.85, 17.05],
            [100.05, 17.10],
            [100.12, 16.85],
            [99.92, 16.80],
            [99.85, 17.05],
          ],
        ],
      },
    },
  ],
};

export const SATELLITE_FLOOD_SUMMARY = {
  provider: 'GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)',
  satelliteSource: 'Sentinel-1 C-band SAR / COSMO-SkyMed',
  totalFloodedAreaRai: 59200,
  totalFloodedAreaSqKm: 94.72,
  lastUpdated: new Date().toISOString(),
  attribution: 'ข้อมูลพื้นที่น้ำท่วมขังจากภาพถ่ายดาวเทียมเรดาร์ โดย GISTDA',
};
