import fs from 'fs';
import path from 'path';

// Using native fetch and FormData
const fileContent = 'Dummy doc content';
fs.writeFileSync('test_badfile.doc', fileContent);

const formData = new FormData();
const fileBlob = new Blob([fileContent], { type: 'application/octet-stream' });
formData.append('documents', fileBlob, 'test_badfile.doc');

try {
  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  console.log('Response:', response.status, data);

  // Check uploads directory
  const uploads = fs.readdirSync('uploads');
  const leakedFiles = uploads.filter(f => f.endsWith('.doc'));

  if (leakedFiles.length > 0) {
    console.error('FAIL: Unsupported file left on disk.');
    process.exit(1);
  } else {
    console.log('PASS: File was cleaned up.');
    process.exit(0);
  }

} catch (e) {
  console.error('Fetch failed', e);
  process.exit(1);
} finally {
  if (fs.existsSync('test_badfile.doc')) fs.unlinkSync('test_badfile.doc');
  // Clean up any left files to prep for real test
  const uploads = fs.readdirSync('uploads');
  for (const file of uploads) {
      if (file !== '.gitkeep' && file.endsWith('.doc')) {
         fs.unlinkSync(path.join('uploads', file));
      }
  }
}
