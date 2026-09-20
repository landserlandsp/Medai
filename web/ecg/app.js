import { createInitialReport, renderReport } from './modules/reportBuilder.js';
import { validateImageFile } from './modules/validation.js';

const state = { objectUrl: null, report: createInitialReport() };
const fileInput = document.querySelector('#ecg-file');
const preview = document.querySelector('#ecg-preview');
const imageStatus = document.querySelector('#image-status');
const clearButton = document.querySelector('#clear-image');
const reportElement = document.querySelector('#report');

function setStatus(message) {
  imageStatus.textContent = message;
}

function clearImage() {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = null;
  preview.removeAttribute('src');
  preview.classList.add('hidden');
  clearButton.disabled = true;
  setStatus('Изображение не выбрано');
  state.report = createInitialReport();
  renderReport(reportElement, state.report);
  fileInput.value = '';
}

function handleFile(file) {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    clearImage();
    setStatus(validation.message);
    return;
  }

  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = URL.createObjectURL(file);
  preview.src = state.objectUrl;
  preview.classList.remove('hidden');
  clearButton.disabled = false;
  setStatus('Файл принят. Технический анализ изображения ещё не реализован.');
  state.report = createInitialReport([
    'Автоматическая интерпретация пока отключена.',
    'Изображение требует дальнейшей проверки качества.',
    'Не вводите персональные медицинские данные в исследовательский прототип.'
  ]);
  renderReport(reportElement, state.report);
}

fileInput.addEventListener('change', () => handleFile(fileInput.files?.[0]));
clearButton.addEventListener('click', clearImage);
renderReport(reportElement, state.report);
