import fs from 'fs';
import { Readable } from 'stream';
import { getDiametersForFileFromMap, loadDiametersMap } from '../../utils/diameters';

jest.mock('fs');

describe('loadDiametersMap', () => {
	const mockedFs = fs as jest.Mocked<typeof fs>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should throw an error if the file does not exist', async() => {
		mockedFs.existsSync.mockReturnValue(false);

		await expect(loadDiametersMap('missing.csv')).rejects.toThrow('File not found');
	});

	it('should throw an error if stream creation fails', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		mockedFs.createReadStream.mockImplementation(() => {
			throw new Error('Stream error');
		});

		await expect(loadDiametersMap('error.csv')).rejects.toThrow('Stream error');
	});

	it('should parse a valid CSV file and return a map of diameters', async() => {
		mockedFs.existsSync.mockReturnValue(true);

		const csvData = `image,disk,diameter_mm
test-image,1,10
test-image,2,15
test-image,3,20
test-image,4,25
test-image,5,30
test-image,6,35`;

		mockedFs.createReadStream.mockReturnValue(Readable.from([csvData]) as any);

		const result = await loadDiametersMap('valid.csv');

		expect(result).toBeInstanceOf(Map);
		expect(result.get('test-image')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 15 },
			{ disk: 3, diameterMm: 20 },
			{ disk: 4, diameterMm: 25 },
			{ disk: 5, diameterMm: 30 },
			{ disk: 6, diameterMm: 35 },
		]);
	});

	it('should skip rows with missing fields', async() => {
		mockedFs.existsSync.mockReturnValue(true);

		const csvData = `image,disk,diameter_mm
test-image,1,10
test-image,,15
test-image,3,`;

		mockedFs.createReadStream.mockReturnValue(Readable.from([csvData]) as any);

		const result = await loadDiametersMap('partial.csv');

		expect(result.get('test-image')).toEqual([
			{ disk: 1, diameterMm: 10 }
		]);
	});

	it('should handle multiple images', async() => {
		mockedFs.existsSync.mockReturnValue(true);

		const csvData = `image,disk,diameter_mm
image1,1,10
image1,2,15
image2,1,20
image2,2,25`;

		mockedFs.createReadStream.mockReturnValue(Readable.from([csvData]) as any);

		const result = await loadDiametersMap('multiple.csv');

		expect(result.get('image1')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 15 },
		]);

		expect(result.get('image2')).toEqual([
			{ disk: 1, diameterMm: 20 },
			{ disk: 2, diameterMm: 25 },
		]);
	});

	it('should ignore rows with non-numeric values', async() => {
		mockedFs.existsSync.mockReturnValue(true);

		const csvData = `image,disk,diameter_mm
test-image,1,10
test-image,X,abc
test-image,2,20`;

		mockedFs.createReadStream.mockReturnValue(Readable.from([csvData]) as any);

		const result = await loadDiametersMap('non-numeric.csv');

		expect(result.get('test-image')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 20 },
		]);
	});
});

describe('getDiametersForFileFromMap', () => {
	it('should return the diameters array for a given image name', () => {
		const map = new Map<string, { disk: number; diameterMm: number }[]>();
		map.set('image-a', [
			{ disk: 1, diameterMm: 12 },
			{ disk: 2, diameterMm: 18 }
		]);

		const result = getDiametersForFileFromMap('image-a', map);

		expect(result).toEqual([
			{ disk: 1, diameterMm: 12 },
			{ disk: 2, diameterMm: 18 }
		]);
	});

	it('should return null if the image name does not exist in the map', () => {
		const map = new Map<string, { disk: number; diameterMm: number }[]>();
		map.set('image-b', [{ disk: 1, diameterMm: 20 }]);

		const result = getDiametersForFileFromMap('image-c', map);

		expect(result).toBeNull();
	});

	it('should return an empty array if image exists but has no data (edge case)', () => {
		const map = new Map<string, { disk: number; diameterMm: number }[]>();
		map.set('image-empty', []);

		const result = getDiametersForFileFromMap('image-empty', map);

		expect(result).toEqual([]);
	});
});