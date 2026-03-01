import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { validatePuzzlePayload } from '@/models/puzzle';

export async function POST(request) {
  try {
    const payload = await request.json();
    const validation = validatePuzzlePayload(payload);

    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const db = await getDb();

    await db.collection('puzzles').updateOne(
      { date: payload.date },
      {
        $set: {
          ...payload,
          updatedAt: new Date().toISOString()
        },
        $setOnInsert: {
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Puzzle saved successfully.' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to save puzzle.', error: error.message },
      { status: 500 }
    );
  }
}
