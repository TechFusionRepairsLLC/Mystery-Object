import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { normalizeGuess } from '@/models/puzzle';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request) {
  try {
    const { guess } = await request.json();

    if (!guess || typeof guess !== 'string') {
      return NextResponse.json(
        { message: 'Guess is required.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const today = getTodayDateString();

    const puzzle = await db.collection('puzzles').findOne(
      { date: today },
      { projection: { _id: 0, objectName: 1 } }
    );

    if (!puzzle) {
      return NextResponse.json(
        { message: 'No puzzle found for today.' },
        { status: 404 }
      );
    }

    const isCorrect = normalizeGuess(guess) === normalizeGuess(puzzle.objectName);

    return NextResponse.json({ isCorrect });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to validate guess.', error: error.message },
      { status: 500 }
    );
  }
}
