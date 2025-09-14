import { Toaster, toast } from 'sonner'

export default function App() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">Anoma Intent Prototype</h1>
      <div className="p-4 rounded-lg shadow bg-white space-y-2">
        <h2 className="text-lg font-semibold">🚀 Tailwind</h2>
        <p className="text-gray-600">
          Якщо ти бачиш кольорову кнопку і нормальний текст — значить Tailwind працює.
        </p>
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
          onClick={() => toast.success("✅ Intent submitted!")}
        >
          Submit Intent
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white shadow">🌐 Vite + Pages</div>
        <div className="p-4 rounded-lg bg-white shadow">🎨 Tailwind</div>
        <div className="p-4 rounded-lg bg-white shadow">🔔 Sonner Toast</div>
      </div>

      <Toaster richColors />
    </div>
  )
}
