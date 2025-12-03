import React, { useState } from 'react';

type CreateTicketFormProps = {
  onSubmit?: (payload: FormData) => void;
  defaultProblemType?: string;
};

const problemTypes = ['Calidad', 'Logística', 'Seguridad', 'Otro'];

export default function CreateTicketForm({ onSubmit, defaultProblemType }: CreateTicketFormProps) {
  const [title, setTitle] = useState('');
  const [problemType, setProblemType] = useState(defaultProblemType || problemTypes[0]);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !description) {
      alert('Título y descripción son obligatorios para cumplir controles IATF');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('problemType', problemType);
    formData.append('description', description);
    files.forEach((file) => formData.append('evidence', file));

    onSubmit?.(formData);
  };

  return (
    <form className="space-y-4 rounded-md bg-white p-6 shadow" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          className="mt-1 w-full rounded border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe brevemente el reclamo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tipo de Problema</label>
        <select
          className="mt-1 w-full rounded border px-3 py-2"
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
        >
          {problemTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          className="mt-1 w-full rounded border px-3 py-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Incluye datos críticos de 8D: defecto, impacto y contención inicial"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Evidencia Fotográfica</label>
        <div
          className={`mt-2 flex min-h-[150px] items-center justify-center rounded border-2 border-dashed px-4 py-6 ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-center text-sm text-gray-600">
            <p>Arrastra y suelta tus imágenes o haz clic para seleccionarlas.</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
          </div>
        </div>
        {files.length > 0 && (
          <ul className="mt-2 list-disc pl-4 text-sm text-gray-700">
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Enviar RMA
      </button>
    </form>
  );
}
