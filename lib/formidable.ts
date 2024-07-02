import { IncomingMessage } from 'http';
import formidable, { File, Files, Fields } from 'formidable';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const parseForm = (req: IncomingMessage): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable({ uploadDir, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
