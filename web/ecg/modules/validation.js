export function validateImageFile(file) {
  if (!file) return { valid: false, message: 'Файл не выбран' };

  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Поддерживаются только JPG и PNG' };
  }
  if (file.size > maxSize) {
    return { valid: false, message: 'Файл превышает допустимый размер 10 МБ' };
  }
  return { valid: true, message: 'Файл прошёл базовую проверку' };
}
