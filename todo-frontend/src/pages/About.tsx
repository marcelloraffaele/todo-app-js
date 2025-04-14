export const About = () => {
  return (
    <div className="container px-4 py-8">
    <h1 className="text-3xl font-bold mb-8 text-center">About</h1>
      <div className="bg-white shadow-md rounded px-8 py-6">
        <p className="text-gray-700 text-lg mb-4">
          This is a simple Todo application built with React and TypeScript.
          It allows you to manage your tasks effectively with features like:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Create new todos with descriptions and categories</li>
          <li>Mark todos as done, active, or canceled</li>
          <li>Delete completed todos</li>
          <li>Organize todos by categories</li>
        </ul>
        <p className="text-gray-700">
          Built with modern web technologies including React, TypeScript, and Tailwind CSS.
        </p>
      </div>
    </div>
  );
};