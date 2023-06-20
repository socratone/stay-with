import { postPushSubscription } from 'helpers/axios';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import { useEffect } from 'react';
import { parseSubscription } from 'utils/push';

const usePushNotification = () => {
  const { user } = useAuth();
  const { data: userData } = useUser(user?._id);

  useEffect(() => {
    (async () => {
      const publicKey = userData?.user.publicKey;
      const userId = user?._id;
      if (!publicKey || !userId) return;

      try {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js');
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        // 이미 구독했다면
        if (subscription) {
          const parsedSubscription = parseSubscription(subscription);
          if (!parsedSubscription) return;
          await postPushSubscription({
            userId,
            pushSubscription: parsedSubscription,
          });
        } else {
          // 첫 구독시에
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicKey,
          });
          const parsedSubscription = parseSubscription(subscription);
          if (!parsedSubscription) return;
          await postPushSubscription({
            userId,
            pushSubscription: parsedSubscription,
          });
        }
      } catch (error) {
        //
      }
    })();
  }, [userData, user]);
};

export default usePushNotification;
