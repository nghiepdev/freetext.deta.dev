import {Deta} from 'deta';

import {NoteText} from './types';

const deta = Deta(process.env.APP_DETA_PROJECT_KEY);

type NodeTextResponse = NoteText | null;

export const db = deta.Base(
  `${process.env.APP_NAME}:${process.env.NODE_ENV || 'default'}`,
);

export async function fetchNoteBySecretKey(__secret: string) {
  const {items} = await db.fetch({__secret}, {limit: 1});

  return items[0] as NodeTextResponse;
}

export async function fetchNoteByKey(key: string) {
  const result = (await db.get(key)) as NodeTextResponse;

  if (result) {
    return result;
  }

  const {items} = await db.fetch({__alias: key}, {limit: 1});

  return items[0] as NodeTextResponse;
}

export function incrementNoteViewCount(note: NoteText) {
  return db.update(
    {
      __views: db.util.increment(1),
    },
    note.key,
  );
}