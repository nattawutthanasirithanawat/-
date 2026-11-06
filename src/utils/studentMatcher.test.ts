import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stripThaiPrefix,
  matchStudentQuery,
  evaluateScore,
  StudentScoreRecord
} from './studentMatcher';

test('stripThaiPrefix removes common Thai titles correctly', () => {
  assert.equal(stripThaiPrefix('เด็กชายสมชาย ใจดี'), 'สมชาย ใจดี');
  assert.equal(stripThaiPrefix('ด.ช. สมชาย'), 'สมชาย');
  assert.equal(stripThaiPrefix('นางสาวกานดา มณีโชติ'), 'กานดา มณีโชติ');
  assert.equal(stripThaiPrefix('น.ส. กานดา'), 'กานดา');
  assert.equal(stripThaiPrefix('นายณัฐวุฒิ'), 'ณัฐวุฒิ');
  assert.equal(stripThaiPrefix('สมชาย'), 'สมชาย');
});

test('matchStudentQuery matches flexible Thai inputs', () => {
  const student: StudentScoreRecord = {
    id: '1',
    prefix: 'เด็กชาย',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    fullName: 'เด็กชายสมชาย ใจดี',
    studentId: '10045',
    level: 'มัธยมศึกษาตอนต้น (ม.1 - 3)',
    school: 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"',
    rawScore: '24/30',
    scoreNumber: 24,
    maxScore: 30,
    percentage: 80,
    isPassed: true,
    statusText: 'ผ่าน'
  };

  // Match by first name only
  assert.equal(matchStudentQuery(student, 'สมชาย'), true);

  // Match by full name without prefix
  assert.equal(matchStudentQuery(student, 'สมชาย ใจดี'), true);

  // Match by full name with title prefix
  assert.equal(matchStudentQuery(student, 'เด็กชายสมชาย ใจดี'), true);
  assert.equal(matchStudentQuery(student, 'ด.ช. สมชาย ใจดี'), true);

  // Match by student ID
  assert.equal(matchStudentQuery(student, '10045'), true);

  // Negative test: unrelated name
  assert.equal(matchStudentQuery(student, 'วิภาวรรณ'), false);
});

test('evaluateScore calculates percentage and pass/fail criteria', () => {
  const result1 = evaluateScore('24/30', 60);
  assert.equal(result1.scoreNumber, 24);
  assert.equal(result1.maxScore, 30);
  assert.equal(result1.percentage, 80);
  assert.equal(result1.isPassed, true);
  assert.equal(result1.statusText, 'ผ่าน');

  const result2 = evaluateScore('15/30', 60);
  assert.equal(result2.percentage, 50);
  assert.equal(result2.isPassed, false);
  assert.equal(result2.statusText, 'ไม่ผ่าน');

  const result3 = evaluateScore('85%', 70);
  assert.equal(result3.percentage, 85);
  assert.equal(result3.isPassed, true);
});
