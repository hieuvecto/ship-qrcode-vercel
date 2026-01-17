import { getBoatById } from "@/actions/boats";
import { BoatCard } from "@/components/boats/boat-card";
import { BoatNotFound } from "@/components/boats/boat-not-found";
import { Metadata } from "next";

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface BoatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BoatPageProps): Promise<Metadata> {
  const { id } = await params;
  const boat = await getBoatById(id);

  if (!boat) {
    return {
      title: "Không tìm thấy tàu",
      description: "Thông tin tàu không tồn tại",
    };
  }

  return {
    title: `Tàu ${boat.boat_number} - ${boat.owner_name}`,
    description: `Thông tin chi tiết về tàu cá ${boat.boat_number} thuộc ${boat.district}`,
  };
}

export default async function BoatPage({ params }: BoatPageProps) {
  const { id } = await params;
  const boat = await getBoatById(id);

  if (!boat) {
    return <BoatNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <BoatCard boat={boat} />
    </div>
  );
}
