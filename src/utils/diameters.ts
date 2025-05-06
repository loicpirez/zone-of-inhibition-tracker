import fs from 'fs';
import csv from 'csv-parser';
import { Diameter } from '../types/diameter';

let diametersMap: Map<string, Diameter[]> | null = null;

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

export function getDiameters(imageName: string): Diameter[] | null {
	if (!diametersMap) {
		throw new Error('Diameters map not loaded');
	
	}
	return diametersMap.get(imageName) || null;
}

export function setDiametersMap(map: Map<string, Diameter[]> | null) {
	diametersMap = map;
}
