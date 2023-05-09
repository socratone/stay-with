import { addQuery, removeQuery } from './url';

describe('removeQuery', () => {
  it('should delete the correct query.', () => {
    expect(
      removeQuery(
        'https://example.com/blog?limit=10&skip=20&search=apple',
        'skip'
      )
    ).toBe('https://example.com/blog?limit=10&search=apple');
  });

  it('should work even when there is no query.', () => {
    expect(removeQuery('https://example.com/blog', 'skip')).toBe(
      'https://example.com/blog'
    );
  });
});

describe('addQuery', () => {
  it('should add the correct query.', () => {
    expect(
      addQuery('https://example.com/blog?limit=10&skip=20', 'search=apple')
    ).toBe('https://example.com/blog?limit=10&search=apple&skip=20');
  });

  it('should work even when there is no query.', () => {
    expect(addQuery('https://example.com/blog', 'search=apple')).toBe(
      'https://example.com/blog?search=apple'
    );
  });
});
