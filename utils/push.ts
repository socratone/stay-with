export const parseSubscription = (subscription: PushSubscription) => {
  // Subscription exists, retrieve the keys
  const subscriptionKeys = subscription.getKey('p256dh');
  const p256dhKey = subscriptionKeys
    ? btoa(
        String.fromCharCode.apply(null, new Uint8Array(subscriptionKeys) as any)
      )
    : null;

  const authKeys = subscription.getKey('auth');
  const authKey = authKeys
    ? btoa(String.fromCharCode.apply(null, new Uint8Array(authKeys) as any))
    : null;

  if (!p256dhKey || !authKey) return null;

  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: p256dhKey,
      auth: authKey,
    },
  };
};
