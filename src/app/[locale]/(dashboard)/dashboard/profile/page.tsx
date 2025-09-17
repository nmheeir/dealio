import AddressSection from './_components/address-section';
import ProfileCard from './_components/profile_card';

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-8">
      <ProfileCard />

      <AddressSection />
    </div>
  );
}
