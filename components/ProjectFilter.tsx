export default function ProjectFilter(){ 
  return (
    <div className="flex gap-2 flex-wrap">
      {['All','Web','Mobile','Game','AI'].map(tag => (
        <button key={tag} className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">{tag}</button>
      ))}
    </div>
  );
}
