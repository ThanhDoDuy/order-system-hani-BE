import { Document } from 'mongoose';

export function transformDocument(doc: Document): any {
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

export function transformDocuments(docs: Document[]): any[] {
  return docs.map(doc => transformDocument(doc));
}
