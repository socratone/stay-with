import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore/lite';
import { app } from './configs';
import { Post } from './interfaces';

const db = getFirestore(app);

export const getPosts = async () => {
  const posts: Post[] = [];
  const querySnapshot = await getDocs(collection(db, 'posts'));
  querySnapshot.forEach((doc) => {
    // TODO: created at 등을 추가해서 order
    posts.push({ id: doc.id, ...doc.data() } as Post);
  });
  return posts;
};

export const addPost = async (payload: Omit<Post, 'id'>) => {
  return addDoc(collection(db, 'posts'), payload);
};

export const getPost = async (id: string) => {
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as Omit<Post, 'id'>;
};

export const updatePost = async (id: string, payload: Omit<Post, 'id'>) => {
  const docRef = doc(db, 'posts', id);
  return await updateDoc(docRef, payload);
};

export const deletePost = async (id: string) => {
  const docRef = doc(db, 'posts', id);
  return await deleteDoc(docRef);
};
