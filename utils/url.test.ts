import { addQuery, removeQuery } from './url';

describe('removeQuery', () => {
  it('should delete the correct query.', () => {
    expect(
      removeQuery(
        'https://example.com/blog?count=10&offset=20&search=apple',
        'offset'
      )
    ).toBe('https://example.com/blog?count=10&search=apple');
  });

  it('should work even when there is no query.', () => {
    expect(removeQuery('https://example.com/blog', 'offset')).toBe(
      'https://example.com/blog'
    );
  });
});

describe('addQuery', () => {
  it('should add the correct query.', () => {
    expect(
      addQuery('https://example.com/blog?count=10&offset=20', 'search=apple')
    ).toBe('https://example.com/blog?count=10&offset=20&search=apple');
  });

  it('should work even when there is no query.', () => {
    expect(addQuery('https://example.com/blog', 'search=apple')).toBe(
      'https://example.com/blog?search=apple'
    );
  });
});
