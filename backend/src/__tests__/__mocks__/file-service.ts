const serveFile = jest.fn((id, res) => {
	if (id === '00000000-0000-0000-0000-000000000000') {
		res.status(404).json({ error: { message: 'File not found' } });
	} else {
		res.set('Content-Disposition', 'attachment; filename="file1.jpg"');
		res.status(200).send('Mocked file content');
	}
});

export default {
	serveFile,
};