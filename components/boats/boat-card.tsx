import { Boat } from "@/types/boat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { vi } from "@/locales/vi";
import { Ship, Calendar, Users, User, Hash, MapPin, Phone, FileCheck, Anchor, Gauge } from "lucide-react";

interface BoatCardProps {
  boat: Boat;
}

export function BoatCard({ boat }: BoatCardProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Ship className="h-6 w-6" />
            {vi.boat.title}
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {boat.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Registration Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.serialNumber}
                  </p>
                  <p className="text-base font-semibold">{boat.serial_number}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.boatNumber}
                  </p>
                  <p className="text-base font-semibold">{boat.boat_number}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.district}
                  </p>
                  <p className="text-base font-semibold">{boat.district}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.registrationDate}
                  </p>
                  <p className="text-base font-semibold">
                    {boat.registration_date}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Ship className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.boatGroup}
                  </p>
                  <p className="text-base font-semibold">{boat.boat_group}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.boatMembers}
                  </p>
                  <p className="text-base font-semibold">{boat.boat_members}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Owner Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.ownerName}
                  </p>
                  <p className="text-base font-semibold">{boat.owner_name}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.citizenId}
                  </p>
                  <p className="text-base font-semibold">{boat.citizen_id}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.phone}
                  </p>
                  <p className="text-base font-semibold">{boat.phone}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.address}
                  </p>
                  <p className="text-base">{boat.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <Separator className="my-6" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {vi.boat.mainJob}
            </p>
            <p className="text-base font-semibold">{boat.main_job}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {vi.boat.sideJob}
            </p>
            <p className="text-base font-semibold">{boat.side_job}</p>
          </div>
        </div>

        {/* Technical & Inspection Info */}
        <Separator className="my-6" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Anchor className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.boatLength}
                  </p>
                  <p className="text-base font-semibold">{boat.boat_length}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.totalPower}
                  </p>
                  <p className="text-base font-semibold">{boat.total_power}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.inspectionNumber}
                  </p>
                  <p className="text-base font-semibold">{boat.inspection_number}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {vi.boat.inspectionExpiryDate}
                  </p>
                  <p className="text-base font-semibold">{boat.inspection_expiry_date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
