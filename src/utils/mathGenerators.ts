import { AppleProblem, FrogProblem, ScaleProblem, ClockProblem, GeometryProblem, Difficulty } from '../types/math';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 1. GENERATE APPLE PROBLEMS (Cộng, trừ có nhớ lớp 2)
export function generateAppleProblem(difficulty: Difficulty): AppleProblem {
  let num1 = 0;
  let num2 = 0;
  let operator: '+' | '-' = Math.random() > 0.5 ? '+' : '-';
  let correctAnswer = 0;

  if (difficulty === 'easy') {
    if (operator === '+') {
      num1 = getRandomInt(10, 40);
      num2 = getRandomInt(2, 9);
      // Non-carry or small carry
    } else {
      num1 = getRandomInt(20, 50);
      num2 = getRandomInt(2, 9);
      if (num1 <= num2) num1 = num2 + 10;
    }
  } else if (difficulty === 'medium') {
    // Grade 2 core: addition/subtraction with carrying in range 100
    if (operator === '+') {
      const tens1 = getRandomInt(1, 6);
      const ones1 = getRandomInt(4, 9);
      const tens2 = getRandomInt(1, 8 - tens1);
      const ones2 = getRandomInt(10 - ones1, 9); // forces ones1 + ones2 >= 10
      num1 = tens1 * 10 + ones1;
      num2 = tens2 * 10 + ones2;
    } else {
      // Subtraction with borrowing
      const tens1 = getRandomInt(3, 9);
      const ones1 = getRandomInt(0, 6);
      const tens2 = getRandomInt(1, tens1 - 1);
      const ones2 = getRandomInt(ones1 + 1, 9); // forces ones1 < ones2
      num1 = tens1 * 10 + ones1;
      num2 = tens2 * 10 + ones2;
    }
  } else {
    // Hard: Range up to 1000
    if (operator === '+') {
      num1 = getRandomInt(120, 550);
      num2 = getRandomInt(80, 400);
    } else {
      num1 = getRandomInt(300, 950);
      num2 = getRandomInt(120, num1 - 20);
    }
  }

  correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;

  // Generate believable distractors
  const distractors = new Set<number>();
  distractors.add(correctAnswer + 10);
  distractors.add(Math.max(1, correctAnswer - 10));
  distractors.add(correctAnswer + 1);
  distractors.add(Math.max(1, correctAnswer - 1));
  distractors.add(operator === '+' ? correctAnswer - 2 : correctAnswer + 2);

  const wrongList = Array.from(distractors).filter(n => n !== correctAnswer);
  const options = shuffle([correctAnswer, wrongList[0] ?? correctAnswer + 5, wrongList[1] ?? correctAnswer - 5]);

  const tens1 = Math.floor(num1 / 10);
  const ones1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10);
  const ones2 = num2 % 10;

  let explanation = '';
  if (operator === '+') {
    const sumOnes = ones1 + ones2;
    if (sumOnes >= 10) {
      explanation = `Bước 1: Cộng hàng đơn vị: ${ones1} + ${ones2} = ${sumOnes}, viết ${sumOnes % 10} nhớ 1.\nBước 2: Cộng hàng chục: ${tens1} + ${tens2} = ${tens1 + tens2}, thêm 1 bằng ${tens1 + tens2 + 1}.\nKết quả: ${correctAnswer}`;
    } else {
      explanation = `Cộng hàng đơn vị: ${ones1} + ${ones2} = ${sumOnes}.\nCộng hàng chục: ${tens1} + ${tens2} = ${tens1 + tens2}.\nKết quả: ${correctAnswer}`;
    }
  } else {
    if (ones1 < ones2) {
      explanation = `Bước 1: Hàng đơn vị: ${ones1} không trừ được ${ones2}, mượn 1 chục là ${ones1 + 10} - ${ones2} = ${ones1 + 10 - ones2}, nhớ 1.\nBước 2: Hàng chục: ${tens1} trừ 1 (đã mượn) còn ${tens1 - 1}, trừ tiếp ${tens2} bằng ${tens1 - 1 - tens2}.\nKết quả: ${correctAnswer}`;
    } else {
      explanation = `Trừ hàng đơn vị: ${ones1} - ${ones2} = ${ones1 - ones2}.\nTrừ hàng chục: ${tens1} - ${tens2} = ${tens1 - tens2}.\nKết quả: ${correctAnswer}`;
    }
  }

  return {
    id: `apple-${Date.now()}-${Math.random()}`,
    num1,
    num2,
    operator,
    correctAnswer,
    options,
    hint: {
      tens1,
      ones1,
      tens2,
      ones2,
      explanation
    }
  };
}

// 2. GENERATE FROG PROBLEMS (Bảng nhân 2, 5 & Bảng chia 2, 5)
export function generateFrogProblem(difficulty: Difficulty): FrogProblem {
  const isMult = difficulty === 'easy' ? true : Math.random() > 0.45;
  const tableBase = Math.random() > 0.5 ? 2 : 5;
  const factor = getRandomInt(1, 10);

  if (isMult) {
    const a = tableBase;
    const b = factor;
    const correctAnswer = a * b;
    const distractors = new Set<number>();
    distractors.add(correctAnswer + tableBase);
    distractors.add(Math.max(1, correctAnswer - tableBase));
    distractors.add(correctAnswer + 2);
    distractors.add(Math.max(1, correctAnswer - 2));

    const wrongList = Array.from(distractors).filter(n => n !== correctAnswer);
    const options = shuffle([correctAnswer, wrongList[0] ?? correctAnswer + 1, wrongList[1] ?? correctAnswer - 1]);

    const visualPrompt = tableBase === 2
      ? `Số 2 được lấy ${b} lần (${Array(b).fill('2').join(' + ')})`
      : `Số 5 được lấy ${b} lần (${Array(b).fill('5').join(' + ')})`;

    return {
      id: `frog-${Date.now()}-${Math.random()}`,
      a,
      b,
      operator: '×',
      correctAnswer,
      options,
      visualPrompt
    };
  } else {
    // Division
    const divisor = tableBase;
    const quotient = factor;
    const dividend = divisor * quotient;

    const distractors = new Set<number>();
    distractors.add(quotient + 1);
    distractors.add(Math.max(1, quotient - 1));
    distractors.add(quotient + 2);

    const wrongList = Array.from(distractors).filter(n => n !== quotient);
    const options = shuffle([quotient, wrongList[0] ?? quotient + 3, wrongList[1] ?? Math.max(1, quotient - 2)]);

    const visualPrompt = `Có ${dividend} bông sen chia đều cho ${divisor} chú ếch. Mỗi chú ếch được mấy bông?`;

    return {
      id: `frog-${Date.now()}-${Math.random()}`,
      a: dividend,
      b: divisor,
      operator: ':',
      correctAnswer: quotient,
      options,
      visualPrompt
    };
  }
}

// 3. GENERATE SCALE PROBLEMS (So sánh số & cấu tạo số)
export function generateScaleProblem(difficulty: Difficulty): ScaleProblem {
  const types = ['direct', 'expression', 'decomposition'];
  const type = difficulty === 'easy' ? 'direct' : types[getRandomInt(0, types.length - 1)];

  let leftValue = 0;
  let leftText = '';
  let rightValue = 0;
  let rightText = '';

  if (type === 'direct') {
    const base = getRandomInt(10, 90) * 10;
    const delta = getRandomInt(-15, 15);
    leftValue = base + getRandomInt(1, 9);
    rightValue = base + delta;
    if (Math.random() > 0.6) rightValue = leftValue; // chance for equal
    leftText = `${leftValue}`;
    rightText = `${rightValue}`;
  } else if (type === 'expression') {
    const tens = getRandomInt(2, 8) * 10;
    const ones = getRandomInt(1, 9);
    const sum = tens + ones;
    leftValue = sum;
    leftText = `${tens} + ${ones}`;
    
    // right side
    const offset = getRandomInt(-2, 2);
    rightValue = sum + offset;
    rightText = `${rightValue}`;
  } else {
    // Decomposition (Trăm, chục, đơn vị)
    const h = getRandomInt(1, 8);
    const t = getRandomInt(1, 9);
    const u = getRandomInt(1, 9);
    leftValue = h * 100 + t * 10 + u;
    leftText = `${h} trăm + ${t} chục + ${u} đơn vị`;

    const flip = getRandomInt(0, 2);
    if (flip === 0) {
      rightValue = leftValue;
    } else if (flip === 1) {
      rightValue = leftValue + 10;
    } else {
      rightValue = leftValue - 10;
    }
    rightText = `${rightValue}`;
  }

  let correctOperator: '>' | '<' | '=' = '=';
  if (leftValue > rightValue) correctOperator = '>';
  else if (leftValue < rightValue) correctOperator = '<';

  return {
    id: `scale-${Date.now()}-${Math.random()}`,
    leftValue,
    leftText,
    rightValue,
    rightText,
    correctOperator,
    leftBreakdown: {
      hundreds: Math.floor(leftValue / 100),
      tens: Math.floor((leftValue % 100) / 10),
      ones: leftValue % 10
    },
    rightBreakdown: {
      hundreds: Math.floor(rightValue / 100),
      tens: Math.floor((rightValue % 100) / 10),
      ones: rightValue % 10
    }
  };
}

// 4. GENERATE CLOCK PROBLEMS (Thám tử thời gian)
export function generateClockProblem(): ClockProblem {
  const clockScenarios = [
    { h: 7, m: 0, text: '7 giờ đúng', period: 'buổi sáng' as const, question: 'Bé dậy ăn sáng và chuẩn bị đến trường vào lúc mấy giờ?' },
    { h: 8, m: 15, text: '8 giờ 15 phút', period: 'buổi sáng' as const, question: 'Tiết học toán đầu tiên của bé bắt đầu lúc mấy giờ?' },
    { h: 11, m: 30, text: '11 giờ 30 phút (11 giờ rưỡi)', period: 'buổi trưa' as const, question: 'Bé và các bạn ăn trưa tại trường lúc mấy giờ?' },
    { h: 2, m: 0, text: '2 giờ chiều (14 giờ)', period: 'buổi chiều' as const, question: 'Bé bắt đầu buổi học chiều lúc mấy giờ?' },
    { h: 4, m: 30, text: '4 giờ 30 phút chiều (16 giờ 30)', period: 'buổi chiều' as const, question: 'Mẹ đón bé tan học về nhà lúc mấy giờ?' },
    { h: 7, m: 15, text: '7 giờ 15 phút tối (19 giờ 15)', period: 'buổi tối' as const, question: 'Bé ngồi vào bàn học bài buổi tối lúc mấy giờ?' },
    { h: 9, m: 0, text: '9 giờ tối (21 giờ)', period: 'buổi tối' as const, question: 'Bé đi ngủ để ngày mai dậy sớm lúc mấy giờ?' },
    { h: 6, m: 30, text: '6 giờ 30 phút sáng', period: 'buổi sáng' as const, question: 'Tiếng chuông đồng hồ báo thức reo lúc mấy giờ?' },
    { h: 3, m: 15, text: '3 giờ 15 phút', period: 'buổi chiều' as const, question: 'Đồng hồ trong lớp học đang chỉ mấy giờ?' },
    { h: 10, m: 0, text: '10 giờ đúng', period: 'buổi sáng' as const, question: 'Giờ ra chơi giữa buổi sáng của bé lúc mấy giờ?' }
  ];

  const picked = clockScenarios[getRandomInt(0, clockScenarios.length - 1)];

  // Generate 3 choices
  const otherTexts = clockScenarios.filter(c => c.text !== picked.text).map(c => c.text);
  const shuffledOthers = shuffle(otherTexts);
  const options = shuffle([picked.text, shuffledOthers[0], shuffledOthers[1]]);

  return {
    id: `clock-${Date.now()}-${Math.random()}`,
    hours: picked.h,
    minutes: picked.m,
    timeString: picked.text,
    periodName: picked.period,
    question: picked.question,
    options,
    correctAnswer: picked.text
  };
}

// 5. GENERATE GEOMETRY & MEASURE PROBLEMS
export function generateGeometryProblem(): GeometryProblem {
  const isMeasure = Math.random() > 0.45;

  if (isMeasure) {
    const items = [
      { name: 'Cây bút chì màu xanh', len: 12 },
      { name: 'Cục tẩy gôm hình quả dâu', len: 4 },
      { name: 'Chiếc kẹp ghim giấy', len: 3 },
      { name: 'Chiếc thước kẻ gập', len: 15 },
      { name: 'Chiếc bút mực tím', len: 14 },
      { name: 'Chiếc lá phong xinh xắn', len: 8 },
      { name: 'Thanh sáp màu cầu vồng', len: 7 }
    ];
    const item = items[getRandomInt(0, items.length - 1)];
    const correctLen = item.len;

    const wrong1 = correctLen + getRandomInt(1, 3);
    const wrong2 = Math.max(1, correctLen - getRandomInt(1, 2));
    const options = shuffle([`${correctLen} cm`, `${wrong1} cm`, `${wrong2} cm`]);

    return {
      id: `geom-${Date.now()}-${Math.random()}`,
      type: 'measure',
      question: `Bé hãy đặt vạch số 0 của thước vào một đầu để đo xem "${item.name}" dài bao nhiêu xăng-ti-mét (cm)?`,
      objectName: item.name,
      actualLengthCm: correctLen,
      options,
      correctAnswer: `${correctLen} cm`,
      unit: 'cm'
    };
  } else {
    // Shapes & Unit conversion
    const shapeScenarios = [
      {
        question: 'Hình tam giác có tất cả bao nhiêu cạnh và bao nhiêu đỉnh?',
        shapeName: 'Hình Tam Giác',
        sides: 3,
        vertices: 3,
        correctAnswer: '3 cạnh và 3 đỉnh',
        options: ['3 cạnh và 3 đỉnh', '4 cạnh và 4 đỉnh', '2 cạnh và 2 đỉnh']
      },
      {
        question: 'Hình tứ giác có tất cả bao nhiêu cạnh và bao nhiêu đỉnh?',
        shapeName: 'Hình Tứ Giác',
        sides: 4,
        vertices: 4,
        correctAnswer: '4 cạnh và 4 đỉnh',
        options: ['4 cạnh và 4 đỉnh', '3 cạnh và 3 đỉnh', '5 cạnh và 5 đỉnh']
      },
      {
        question: 'Đổi đơn vị: 1 đề-xi-mét (1 dm) bằng bao nhiêu xăng-ti-mét (cm)?',
        correctAnswer: '10 cm',
        options: ['10 cm', '100 cm', '1 cm']
      },
      {
        question: 'Đổi đơn vị: 1 mét (1 m) bằng bao nhiêu xăng-ti-mét (cm)?',
        correctAnswer: '100 cm',
        options: ['100 cm', '10 cm', '1000 cm']
      },
      {
        question: 'Hình chữ nhật và hình vuông đều thuộc loại hình nào dưới đây?',
        correctAnswer: 'Hình tứ giác (có 4 cạnh)',
        options: ['Hình tứ giác (có 4 cạnh)', 'Hình tam giác', 'Hình tròn']
      }
    ];

    const picked = shapeScenarios[getRandomInt(0, shapeScenarios.length - 1)];
    return {
      id: `geom-${Date.now()}-${Math.random()}`,
      type: 'shape',
      question: picked.question,
      shapeName: picked.shapeName,
      sides: picked.sides,
      vertices: picked.vertices,
      options: shuffle(picked.options),
      correctAnswer: picked.correctAnswer
    };
  }
}
