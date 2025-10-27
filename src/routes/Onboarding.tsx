import { Link } from 'react-router-dom';

const Onboarding = () => {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Welcome to MenuMagique</h1>
        <p className="text-sm text-slate-600">
          A streamlined meal-planning companion focused on mobile-first workflows.
        </p>
      </div>
      <ul className="grid gap-3 text-left text-slate-600">
        <li className="rounded-lg border border-slate-200 bg-white p-4">
          Capture recipes from the web with readability parsing and store them locally.
        </li>
        <li className="rounded-lg border border-slate-200 bg-white p-4">
          Drag-and-drop meals into your week with tactile planner tools.
        </li>
        <li className="rounded-lg border border-slate-200 bg-white p-4">
          Generate shopping lists and export them as shareable PDFs.
        </li>
      </ul>
      <div>
        <Link
          to="/"
          className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm"
        >
          Start planning
        </Link>
      </div>
    </section>
  );
};

export default Onboarding;
