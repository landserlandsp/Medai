# Контракт предварительного отчёта ЭКГ

Отчёт должен быть структурированным объектом, а не свободным медицинским текстом.

```json
{
  "status": "not_analyzed",
  "quality": {
    "status": "unknown",
    "score": null,
    "warnings": []
  },
  "measurements": {
    "heartRate": { "value": null, "unit": "bpm", "confidence": "not_available" },
    "rhythm": { "value": null, "confidence": "not_available" },
    "regularity": { "value": null, "confidence": "not_available" },
    "prInterval": { "value": null, "unit": "ms", "confidence": "not_available" },
    "qrsDuration": { "value": null, "unit": "ms", "confidence": "not_available" },
    "qtCorrected": { "value": null, "unit": "ms", "confidence": "not_available" },
    "axis": { "value": null, "confidence": "not_available" },
    "stT": { "value": null, "confidence": "not_available" }
  },
  "summary": null,
  "limitations": []
}
```

Никакое поле не должно заполняться предположением, если качество или алгоритм не позволяют его измерить.
