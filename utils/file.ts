import fs from 'fs';
import path from 'path';

export const getFileNames = (folderPath: string) => {
  const fullPath = path.join(process.cwd(), folderPath);
  const files = fs.readdirSync(folderPath);

  // Filter out directories from the list of files
  const fileNames = files.filter((file) => {
    const filePath = path.join(fullPath, file);
    return fs.statSync(filePath).isFile();
  });

  return fileNames;
};
