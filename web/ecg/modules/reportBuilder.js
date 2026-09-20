const EMPTY_VALUE = 'Не определено';

export function createInitialReport(extraLimitations = []) {
  return {
    status: 'not_analyzed',
    quality: 'Не оценено',
    measurements: [
      ['Ритм', EMPTY_VALUE],
      ['Частота', EMPTY_VALUE],
      ['Регулярность', EMPTY_VALUE],
      ['PR', EMPTY_VALUE],
      ['QRS', EMPTY_VALUE],
      ['QT/QTc', EMPTY_VALUE],
      ['Электрическая ось', EMPTY_VALUE],
      ['ST-T', EMPTY_VALUE]
    ],
    limitations: [
      'Результат не является диагнозом.',
      'Проверка врачом обязательна.',
      ...extraLimitations
    ]
  };
}

export function renderReport(container, report) {
  container.replaceChildren();
  const quality = document.createElement('div');
  quality.className = 'report-warning';
  quality.textContent = `Статус анализа: ${report.quality}`;
  container.appendChild(quality);

  report.measurements.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'report-row';
    const name = document.createElement('span');
    const result = document.createElement('strong');
    name.textContent = label;
    result.textContent = value;
    row.append(name, result);
    container.appendChild(row);
  });

  const limitations = document.createElement('div');
  limitations.className = 'report-warning';
  limitations.textContent = `Ограничения: ${report.limitations.join(' ')}`;
  container.appendChild(limitations);
}
