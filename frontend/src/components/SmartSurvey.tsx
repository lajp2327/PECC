import React, { useMemo, useState } from 'react';
import { useMemo, useState } from 'react';
type SmartSurveyProps = {
  ticketStatus: string;
  onSubmit?: (payload: { rating: number; comments?: string }) => void;
};

const ratingScale = [1, 2, 3, 4, 5];

export default function SmartSurvey({ ticketStatus, onSubmit }: SmartSurveyProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const shouldShowSurvey = useMemo(() => ticketStatus === 'Cerrado', [ticketStatus]);
  const shouldAskImprovement = rating !== null && rating < 3;

  if (!shouldShowSurvey) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) return;
    onSubmit?.({ rating, comments: comments || undefined });
  };

  return (
    <form className="mt-6 space-y-4 rounded-md border bg-white p-4 shadow" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Tu experiencia nos importa</p>
          <p className="text-xs text-gray-500">Ayúdanos a mejorar respondiendo esta encuesta inteligente.</p>
        </div>
        <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Cerrado</span>
      </div>

      <div className="flex items-center space-x-2">
        {ratingScale.map((value) => (
          <button
            key={value}
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold transition ${
              rating === value ? 'border-yellow-500 bg-yellow-100 text-yellow-700' : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
            onClick={() => setRating(value)}
            aria-label={`Calificación ${value}`}
          >
            {value <= 3 ? '😐' : '😊'}
          </button>
        ))}
      </div>

      {shouldAskImprovement && (
        <div>
          <label className="block text-sm font-medium text-gray-700">¿Qué podemos mejorar?</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2"
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Describe acciones correctivas esperadas o brechas detectadas en el proceso"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!rating}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        Enviar feedback
      </button>
    </form>
  );
}
