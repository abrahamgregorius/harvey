import { fileURLToPath } from 'url';

const SOIL_PARAMS = {
  Andosol: { fc: 0.35, wp: 0.20 },
  Regosol: { fc: 0.15, wp: 0.05 },
  Latosol: { fc: 0.30, wp: 0.18 }
};

const CROP_PARAMS = {
  Padi: {
    p: 0.2,
    kc: [1.10, 1.10, 1.10, 1.15, 1.15, 1.15, 1.20, 1.20, 1.15, 1.10, 0.90, 0.60],
    zr: [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.40, 0.40, 0.40, 0.40, 0.40]
  },
  Palawija: {
    p: 0.3,
    kc: [0.30, 0.40, 0.70, 0.90, 1.15, 1.15, 1.15, 1.10, 1.00, 0.80, 0.60, 0.40],
    zr: [0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.80, 0.80, 0.80, 0.80]
  }
};

/**
 * @param {number} latitude
 * @param {number} dayOfYear
 * @returns {number}
 */
function calculateRa(latitude, dayOfYear) {
  const phi = (latitude * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * dayOfYear) / 365 - 1.39);
  const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(delta))));
  const term = ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws);
  return 15.335 * dr * term;
}

/**
 * @param {Object} input
 * @param {string} input.soilType
 * @param {string} input.cropType
 * @param {string} input.plantDate
 * @param {string} input.logDate
 * @param {number} input.latitude
 * @param {number} input.tempMax
 * @param {number} input.tempMin
 * @param {number} input.rainfallMm
 * @param {number} input.irrigationMm
 * @param {number} [input.previousSoilWaterDeficit]
 * @returns {Object}
 */
export function calculateDailyRiskScore(input) {
  const {
    soilType,
    cropType,
    plantDate,
    logDate,
    latitude,
    tempMax,
    tempMin,
    rainfallMm,
    irrigationMm,
    previousSoilWaterDeficit
  } = input;

  const daysSincePlanting = Math.max(0, Math.floor((new Date(logDate) - new Date(plantDate)) / (1000 * 60 * 60 * 24)));
  const weekIndex = Math.min(11, Math.floor(daysSincePlanting / 7));

  const soil = SOIL_PARAMS[soilType] || SOIL_PARAMS.Latosol;
  const crop = CROP_PARAMS[cropType] || CROP_PARAMS.Padi;
  const kc = crop.kc[weekIndex];
  const zr = crop.zr[weekIndex];
  const p = crop.p;

  const taw = 1000 * (soil.fc - soil.wp) * zr;
  const raw = p * taw;

  const dateObj = new Date(logDate);
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dateObj - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  const ra = calculateRa(latitude, dayOfYear);
  const tempMean = (tempMax + tempMin) / 2;
  const et0 = 0.0023 * ra * (tempMean + 17.8) * Math.sqrt(Math.max(0, tempMax - tempMin));
  const etc = et0 * kc;

  const prevDeficit = (previousSoilWaterDeficit !== null && previousSoilWaterDeficit !== undefined)
    ? previousSoilWaterDeficit
    : (daysSincePlanting <= 0 ? 0.0 : raw * 0.5);

  const rawDeficit = prevDeficit - rainfallMm - irrigationMm + etc;
  const soilWaterDeficit = Math.max(0, Math.min(taw, rawDeficit));

  let riskScore = 0.0;
  if (soilWaterDeficit > raw) {
    if (taw > raw) {
      riskScore = (soilWaterDeficit - raw) / (taw - raw);
    } else {
      riskScore = 1.0;
    }
  }
  riskScore = Math.max(0.0, Math.min(1.0, riskScore));

  return {
    taw: parseFloat(taw.toFixed(2)),
    raw: parseFloat(raw.toFixed(2)),
    et0: parseFloat(et0.toFixed(2)),
    etc: parseFloat(etc.toFixed(2)),
    soilWaterDeficit: parseFloat(soilWaterDeficit.toFixed(2)),
    riskScore: parseFloat(riskScore.toFixed(2))
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const testInput = {
    soilType: 'Andosol',
    cropType: 'Padi',
    plantDate: '2026-06-15',
    logDate: '2026-07-17',
    latitude: -6.2008,
    tempMax: 32.5,
    tempMin: 23.0,
    rainfallMm: 5.2,
    irrigationMm: 0.0,
    previousSoilWaterDeficit: 12.0
  };
  const result = calculateDailyRiskScore(testInput);
  console.log(JSON.stringify(result, null, 2));
}
