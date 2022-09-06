import Editor from "./editor";

export default function Index() {
  return (
    <div className="w-screen min-h-screen dark:text-white dark:bg-slate-600">
      <main className="max-w-prose mx-auto pt-12">
        <Editor />
      </main>
    </div>
  );
}
