export default function SeekerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seeker Dashboard</h1>
      <p className="mt-2">Welcome, job seeker! 🎯</p>
      <ul className="mt-4 list-disc pl-5">
        <li>Profile completion: 40%</li>
        <li>Suggested jobs: 3</li>
        <li>Saved jobs: 2</li>
      </ul>
    </div>
  );
}
