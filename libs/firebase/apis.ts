import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { app } from './configs';
import { Post } from './interfaces';

const db = getFirestore(app);

export const getPosts = async () => {
  const posts: Post[] = [];
  const querySnapshot = await getDocs(collection(db, 'posts'));
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
};
