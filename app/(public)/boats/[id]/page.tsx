import { getBoatById } from "@/actions/boats";
import { BoatCard } from "@/components/boats/boat-card";
import { BoatNotFound } from "@/components/boats/boat-not-found";
import { Metadata } from "next";

interface BoatPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Return at least one ID for build-time validation (required by cacheComponents)
// Other boats will be rendered on-demand
// Uses a mock ID to avoid fetching real data during build
export async function generateStaticParams() {
  // Use a non-existent ID to satisfy build validation without fetching real data
  return [{ id: "__build_placeholder__" }];
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
