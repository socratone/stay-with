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
  where,
  deleteField,
} from 'firebase/firestore/lite';
import { app } from './configs';
import { Post, User } from './interfaces';

const db = getFirestore(app);

const USERS = 'users';
const POSTS = 'posts';

/**
 * users
 */

export const addUser = async (payload: Omit<User, 'id'>) => {
  const usersRef = collection(db, USERS);
  const docRef = await addDoc(usersRef, payload);
  return { ...payload, id: docRef.id };
};

export const getUserByEmail = async (email: string) => {
  const users: User[] = [];
  const usersRef = collection(db, USERS);
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as User);
  });
  return users[0] ?? null;
};

/**
 * posts
 */

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
  payload: Omit<Post, 'id' | 'createdAt' | 'likedUsers'>
) => {
  const docRef = doc(db, POSTS, id);
  return await updateDoc(docRef, payload);
};

export const deletePost = async (id: string) => {
  const docRef = doc(db, POSTS, id);
  return await deleteDoc(docRef);
};

export const addLikeToPost = async (id: string, payload: User) => {
  const docRef = doc(db, POSTS, id);

  // https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
  const data = {
    [`likedUsers.${payload.id}.name`]: payload.name,
    [`likedUsers.${payload.id}.email`]: payload.email,
  };

  if (payload.image) {
    data[`likedUsers.${payload.id}.image`] = payload.image;
  }

  return await updateDoc(docRef, data);
};

export const deleteLikeInPost = async (
  id: string,
  payload: Pick<User, 'id'>
) => {
  const docRef = doc(db, POSTS, id);

  // https://firebase.google.com/docs/firestore/manage-data/delete-data
  return await updateDoc(docRef, {
    [`likedUsers.${payload.id}`]: deleteField(),
  });
};
