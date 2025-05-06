import fs from 'fs';
import csv from 'csv-parser';
import { Diameter } from '../types/diameter';

export async function loadDiametersMap(filePath: string): Promise<Map<string, Diameter[]>> {
	if (!fs.existsSync(filePath)) {
		throw new Error('File not found');
	}

	return new Promise((resolve, reject) => {
		const map = new Map<string, Diameter[]>();

		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', (row) => {
				const { image, disk, diameter_mm: diameterMm } = row;

				const diskNum = parseInt(disk, 10);
				const diameterNum = parseFloat(diameterMm);

				if (!image || isNaN(diskNum) || isNaN(diameterNum)) return;

				if (!map.has(image)) {
					map.set(image, []);
				}

				const imageDiameters = map.get(image);
				if (imageDiameters) {
					imageDiameters.push({
						disk: diskNum,
						diameterMm: diameterNum,
					});
				}
			})
			.on('end', () => {
				resolve(map);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}

export function getDiametersForFileFromMap(
	imageName: string,
	diametersMap: Map<string, Diameter[]>
): Diameter[] | null {
	return diametersMap.get(imageName) || null;
}

