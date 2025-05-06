import fs from 'fs';
import { Readable } from 'stream';
import { getDiameters, loadDiametersMap, setDiametersMap } from '../../utils/diameters';

jest.mock('fs');

function mockReadStream(data: string): fs.ReadStream {
	return Readable.from([data]) as fs.ReadStream;
}

describe('loadDiametersMap', () => {
	const mockedFs = fs as jest.Mocked<typeof fs>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		mockedFs.existsSync.mockReset();
		mockedFs.createReadStream.mockReset();
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

	it('should parse a valid CSV file with proper fields', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1,disk 2,disk 3
test-image,10 mm,15mm,20.5mm`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));

		const result = await loadDiametersMap('valid.csv');
		expect(result.get('test-image.png')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 15 },
			{ disk: 3, diameterMm: 20.5 },
		]);
	});

	it('should ignore rows with missing image name', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1
,10`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));
		const result = await loadDiametersMap('no-image.csv');
		expect(result.size).toBe(0);
	});

	it('should skip non-numeric diameter values', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1,disk 2
test-image,abc,20`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));
		const result = await loadDiametersMap('nonnumeric.csv');
		expect(result.get('test-image.png')).toEqual([{ disk: 2, diameterMm: 20 }]);
	});

	it('should skip rows with no valid diameter data', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1
test-image,`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));
		const result = await loadDiametersMap('empty.csv');
		expect(result.size).toBe(0);
	});

	it('should handle trailing spaces in disk headers', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1 ,disk 2 
test-image,10,20`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));
		const result = await loadDiametersMap('spaces.csv');
		expect(result.get('test-image.png')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 20 },
		]);
	});

	it('should handle multiple images properly', async() => {
		mockedFs.existsSync.mockReturnValue(true);
		const csvData = `image file name,disk 1,disk 2
img1,10 mm,15 mm
img2,20 mm,25 mm`;

		mockedFs.createReadStream.mockReturnValue(mockReadStream(csvData));
		const result = await loadDiametersMap('multiple.csv');

		expect(result.get('img1.png')).toEqual([
			{ disk: 1, diameterMm: 10 },
			{ disk: 2, diameterMm: 15 },
		]);

		expect(result.get('img2.png')).toEqual([
			{ disk: 1, diameterMm: 20 },
			{ disk: 2, diameterMm: 25 },
		]);
	});
});

describe('getDiameters', () => {
	afterEach(() => {
		setDiametersMap(null);
	});

	it('should return the correct array for an existing image', () => {
		const map = new Map();
		map.set('image-a.png', [
			{ disk: 1, diameterMm: 12 },
			{ disk: 2, diameterMm: 18 },
		]);
		setDiametersMap(map);

		expect(getDiameters('image-a.png')).toEqual([
			{ disk: 1, diameterMm: 12 },
			{ disk: 2, diameterMm: 18 },
		]);
	});

	it('should return null if image name not found', () => {
		const map = new Map();
		map.set('image-b.png', [{ disk: 1, diameterMm: 20 }]);
		setDiametersMap(map);

		expect(getDiameters('missing.png')).toBeNull();
	});



	it('should return empty array if entry exists with no data', () => {
		const map = new Map();
		map.set('image-empty.png', []);
		setDiametersMap(map);

		expect(getDiameters('image-empty.png')).toEqual([]);
	});

	it('should throw if diametersMap not loaded', () => {
		setDiametersMap(null);
		expect(() => getDiameters('image.png')).toThrow('Diameters map not loaded');
	});
});
