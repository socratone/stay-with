import { NextSeo } from 'next-seo';
import { useIntl } from 'react-intl';

type MetaProps = {
  title?: string;
  description?: string;
};

const Meta: React.FC<MetaProps> = ({ title, description }) => {
  const { formatMessage } = useIntl();

  return (
    <NextSeo
      title={title || formatMessage({ id: 'meta.title' })}
      description={description || formatMessage({ id: 'meta.description' })}
      openGraph={{
        title,
        description,
        images: [
          {
            url: 'https://staywith.kr/images/stay-with-og.jpg',
          },
        ],
      }}
    />
  );
};

export default Meta;
