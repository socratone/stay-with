import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

const addTargetBlankToAnchor = (html: string) => {
  return html.replaceAll(
    '<a href=',
    '<a target="_blank" rel="noopener noreferrer" href='
  );
};

export const parseMarkdownToHtml = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return addTargetBlankToAnchor(result.toString());
};

export const parseMarkdownFile = (fileName: string) => {
  const fullPath = path.join(process.cwd(), fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    metadata: data,
    content,
  };
};
