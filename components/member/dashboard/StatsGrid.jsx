import { Heart, PlayCircle, BookOpen, Users } from 'lucide-react';
import ActivityCard from '../ui/ActivityCard';

export default function StatsGrid() {
  return (
    <div className="grid sm:grid-cols-2 max-sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <ActivityCard title="Giving History" value="K 2,450" subtitle="Silver Partner" icon={Heart} colorClass="bg-pink-50 text-pink-600" />
      <ActivityCard title="Sermon Review" value="12" subtitle="The Warrior Within" icon={PlayCircle} colorClass="bg-blue-50 text-blue-600" />
      <ActivityCard title="Book Reading" value="4/5" subtitle="Word-full" icon={BookOpen} colorClass="bg-orange-50 text-orange-600" />
      <ActivityCard title="Attendance" value="92%" subtitle="Manda Hill Cell" icon={Users} colorClass="bg-green-50 text-green-600" />
    </div>
  );
}
