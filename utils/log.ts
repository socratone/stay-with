type SendCustomLogParams = {
  message: string;
  metadata: any;
};

export const sendCustomLog = ({ message, metadata }: SendCustomLogParams) => {
  if (process.env.NEXT_PUBLIC_ENV !== 'production') return;

  fetch(
    `https://api.logflare.app/logs/json?source=${process.env.LOGFLARE_SOURCE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-API-KEY': process.env.LOGFLARE_API_KEY ?? '',
      },
      body: JSON.stringify({
        message,
        metadata,
      }),
    }
  );
};
