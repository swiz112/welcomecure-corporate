// helpers/emailHelper.js
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import fs from 'fs';
import path from 'path';


// Hostinger IMAP configuration
const hostingerConfig = {
  imap: {
    user: 'saloni@wizcoder.com', // your Hostinger email
    password: 'Saloni@2025',   // email account password
    host: 'imap.hostinger.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
};

export async function fetchLatestExportEmail(testTitle = 'export') {
  console.log('Connecting to IMAP server...');
  const connection = await imaps.connect(hostingerConfig);
  await connection.openBox('INBOX');
  console.log('Searching for unseen emails with subject containing \'Export\'...');

  // Search unseen emails with subject containing 'Export'
  const searchCriteria = ['UNSEEN', ['SUBJECT', 'Export']];
  const messages = await connection.search(searchCriteria, { bodies: ['HEADER.FIELDS (SUBJECT)'], struct: true });
  console.log(`Found ${messages.length} unseen email(s) with 'Export' in the subject.`);

  if (messages.length === 0) {
    connection.end();
    throw new Error('No new export email found!');
  }

  const latest = messages[messages.length - 1];
  const allParts = imaps.getParts(latest.attributes.struct);
  let attachmentFound = false;

  for (const part of allParts) {
    if (part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT') {
      attachmentFound = true;
      console.log('Found attachment, downloading...');
      const attachment = await connection.getPartData(latest, part);
      const downloadsDir = path.resolve(__dirname, '..', 'tests', 'members', 'export', 'downloads');
      if (!fs.existsSync(downloadsDir)) {
        console.log(`Creating downloads directory at: ${downloadsDir}`)
        fs.mkdirSync(downloadsDir, { recursive: true });
      }
      const originalFilename = part.disposition.params.filename;
      const sanitizedTitle = testTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const uniqueFilename = `${sanitizedTitle}_${Date.now()}_${originalFilename}`;
      const filePath = path.join(downloadsDir, uniqueFilename);
      fs.writeFileSync(filePath, attachment);
      console.log(`Attachment saved at: ${filePath}`);
      connection.end();
      return filePath;
    }
  }

  connection.end();
  if (!attachmentFound) {
    console.log('No attachment found in the latest email.');
    throw new Error('No attachment found in the export email.');
  }
}
