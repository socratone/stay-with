import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore/lite';
import { app } from './configs';
import { Post } from './interfaces';

const db = getFirestore(app);

const POSTS = 'posts';

// posts

export const getPostsInfinite = async (createdAt = Infinity) => {
  const posts: Post[] = [];
  const postsRef = collection(db, POSTS);
  const q = query(
    postsRef,
    orderBy('createdAt', 'desc'),
    startAfter(createdAt),
    limit(20) // 한 번에 불러오는 수
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
};

// TODO: 참고 후 삭제
// export const getPosts = async () => {
//   const posts: Post[] = [];
//   const postsRef = collection(db, POSTS);
//   const q = query(postsRef, orderBy('createdAt', 'desc'));
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     posts.push({ id: doc.id, ...doc.data() } as Post);
//   });
//   return posts;
// };

export const addPost = async (payload: Omit<Post, 'id'>) => {
  const postsRef = collection(db, POSTS);
  return addDoc(postsRef, payload);
};

export const getPost = async (id: string) => {
  const docRef = doc(db, POSTS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Omit<Post, 'id'>;
};

export const updatePost = async (
  id: string,
  payload: Omit<Post, 'id' | 'createdAt'>
) => {
  const docRef = doc(db, POSTS, id);
  return await updateDoc(docRef, payload);
};

export const deletePost = async (id: string) => {
  const docRef = doc(db, POSTS, id);
  return await deleteDoc(docRef);
};
