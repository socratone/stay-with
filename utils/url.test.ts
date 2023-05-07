import { getUrlPath } from './url';

describe('getUrlPath', () => {
  it('should only return the URL path.', () => {
    expect(getUrlPath('https://example.com/blog?search=apple')).toBe(
      'https://example.com/blog'
    );
  });

  it('should work even when there is no query.', () => {
    expect(getUrlPath('https://example.com/blog')).toBe(
      'https://example.com/blog'
    );
  });
});
