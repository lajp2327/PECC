const steps = ['Recibido', 'Análisis', 'Acciones', 'Cerrado'] as const;

type StatusTrackerProps = {
  status: (typeof steps)[number];
};

export default function StatusTracker({ status }: StatusTrackerProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      {steps.map((step, index) => {
        const isCompleted = steps.indexOf(status) >= index;
        return (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                isCompleted ? 'border-green-600 bg-green-100 text-green-700' : 'border-gray-300 bg-white text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-2 h-1 flex-1 ${steps.indexOf(status) > index ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
            <div className="ml-2 text-sm font-medium text-gray-700">{step}</div>
          </div>
        );
      })}
    </div>
  );
}
