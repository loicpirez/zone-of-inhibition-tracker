import fs from 'fs';
import csv from 'csv-parser';
import { Diameter } from '../types/diameter';

let diametersMap: Map<string, Diameter[]> | null = null;

/**
 * Loads a map associating each image with an array of disk diameters.
 *
 * The CSV file should have a column named "image file name" and up to 6 columns for "disk 1" through "disk 6".
 * Non-numeric characters are stripped and values are parsed as floats.
 *
 * @param {string} filePath - Path to the CSV file.
 * @returns {Promise<Map<string, Diameter[]>>} - A promise that resolves with the image-to-diameter map.
 * @throws {Error} - If the file does not exist.
 */
export async function loadDiametersMap(filePath: string): Promise<Map<string, Diameter[]>> {
	if (!fs.existsSync(filePath)) {
		throw new Error('File not found');
	}

	return new Promise((resolve, reject) => {
		const map = new Map<string, Diameter[]>();
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (row) => {
				const rawImage = row['image file name'];
				if (!rawImage) return;
				const image = rawImage.trim() + '.png';

				const diameters: Diameter[] = [];
				for (let i = 1; i <= 6; i++) {
					const raw = row[`disk ${i}`] || row[`disk ${i} `];
					if (!raw) continue;

					const cleaned = raw.replace(/[^\d.]/g, '');
					const num = parseFloat(cleaned);
					if (!isNaN(num)) {
						diameters.push({ disk: i, diameterMm: num });
					}
				}

				if (diameters.length > 0) {
					map.set(image, diameters);
				}
			})
			.on('end', () => {
				diametersMap = map;
				resolve(map);
			})
			.on('error', reject);
	});
}

/**
 * Retrieves diameters associated with a given image filename.
 *
 * @param {string} imageName - Image file name (e.g., "image1.png").
 * @returns {Diameter[] | null} - The list of diameters or `null` if none are found.
 * @throws {Error} - If the map hasn't been loaded yet.
 */
export function getDiameters(imageName: string): Diameter[] | null {
	if (!diametersMap) {
		throw new Error('Diameters map not loaded');
	}
	return diametersMap.get(imageName) || null;
}

/**
 * Manually sets the diameters map.
 *
 * @param {Map<string, Diameter[]> | null} map - The map to set or null to reset.
 */
export function setDiametersMap(map: Map<string, Diameter[]> | null) {
	diametersMap = map;
}
