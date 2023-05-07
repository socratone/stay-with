import { filterUrlQuery, getUrlPath } from './url';

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

describe('filterUrlQuery', () => {
  it('should delete the correct query.', () => {
    expect(
      filterUrlQuery(
        'https://example.com/blog?count=10&offset=20&search=apple',
        'offset'
      )
    ).toBe('https://example.com/blog?count=10&search=apple');
  });

  it('should work even when there is no query.', () => {
    expect(filterUrlQuery('https://example.com/blog', 'offset')).toBe(
      'https://example.com/blog'
    );
  });
});
