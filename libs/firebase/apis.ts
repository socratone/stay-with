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
  where,
} from 'firebase/firestore/lite';
import { app } from './configs';
import { Post, User } from './interfaces';

const db = getFirestore(app);

const POSTS = 'posts';
const USERS = 'users';

// posts

export const getPosts = async () => {
  const posts: Post[] = [];
  const postsRef = collection(db, POSTS);
  const querySnapshot = await getDocs(postsRef);
  querySnapshot.forEach((doc) => {
    // TODO: created at 등을 추가해서 order
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

export const updatePost = async (id: string, payload: Omit<Post, 'id'>) => {
  const docRef = doc(db, POSTS, id);
  return await updateDoc(docRef, payload);
};

export const deletePost = async (id: string) => {
  const docRef = doc(db, POSTS, id);
  return await deleteDoc(docRef);
};

// users

export const addUser = async (payload: Omit<User, 'id'>) => {
  const usersRef = collection(db, USERS);
  return addDoc(usersRef, payload);
};

export const getUser = async (id: string) => {
  const docRef = doc(db, USERS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Omit<User, 'id'>;
};

export const getUserByEmail = async (email: string) => {
  const users: User[] = [];
  const usersRef = collection(db, USERS);
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() } as User);
  });
  const mappedUsers = users.map((user) => {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  });
  return mappedUsers?.[0];
};
