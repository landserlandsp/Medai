// Reserved for image sharpness, perspective, grid and ECG trace checks.
// This module must return a refusal when quality is insufficient; it must not guess.
export function assessImageQuality() {
  return {
    status: 'not_implemented',
    score: null,
    warnings: ['Оценка качества изображения ещё не реализована.']
  };
}
