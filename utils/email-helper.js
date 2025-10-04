import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import fs from 'fs';
import path from 'path';

const hostingerConfig = {
  imap: {
    user: 'saloni@wizcoder.com',
    password: 'Saloni@2025',
    host: 'imap.hostinger.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
};

/**
 * Fetch all export emails and save attachments with test case name
 * @param {string} testTitle - Exact test case name
 * @returns {string[]} Array of downloaded attachment file paths
 */
export async function fetchAllExportEmails(testTitle) {
  const connection = await imaps.connect(hostingerConfig);
  await connection.openBox('INBOX');
  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  const searchCriteria = ['UNSEEN', ['SUBJECT', 'Family Members List Export']];
  const messages = await connection.search(searchCriteria, { bodies: ['HEADER.FIELDS (SUBJECT)'], struct: true });
  console.log(`Found ${messages.length} unseen email(s) with 'Export' in the subject.`);

  if (messages.length === 0) {
    connection.end();
    throw new Error('No new export email found!');
  }

  const downloadsDir = path.resolve(__dirname, '..', 'tests', 'members', 'export', 'downloads');
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  const savedFiles = [];
  const safeTestTitle = (testTitle || '')
    .replace(/[^a-z0-9]+/gi, '_')   // replace non-alphanumerics with underscore
    .replace(/^_+|_+$/g, '');        // remove leading/trailing underscores

  for (const msg of messages) {
    const allParts = imaps.getParts(msg.attributes.struct);
    let counter = 1; // To handle multiple attachments in one email
    for (const part of allParts) {
      if (part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT') {
        const attachment = await connection.getPartData(msg, part);
        const originalFilename = part.disposition.params.filename;
        const sanitizedTitle = (testTitle || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const timestamp = Date.now();
        const uniqueFilename = `${sanitizedTitle}_${timestamp}_${originalFilename}`;
        const filePath = path.join(downloadsDir, uniqueFilename);

        fs.writeFileSync(filePath, attachment);
        console.log(`Attachment saved at: ${filePath}`);
        savedFiles.push(filePath);
        await connection.addFlags(msg.attributes.uid, '\Seen');
      }
    }
  }

  connection.end();

  if (savedFiles.length === 0) {
    throw new Error('No attachments found in the export emails.');
  }

  return savedFiles; // returns array of all downloaded attachments
}