import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const db = await getDb();
    const today = getTodayDateString();

    const puzzle = await db.collection('puzzles').findOne(
      { date: today },
      {
        projection: {
          _id: 0,
          date: 1,
          clue1Image: 1,
          clue2Image: 1,
          clue3Image: 1,
          fullImage: 1
        }
      }
    );

    if (!puzzle) {
      return NextResponse.json(
        { message: 'No puzzle found for today.' },
        { status: 404 }
      );
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch today puzzle.', error: error.message },
      { status: 500 }
    );
  }
}
