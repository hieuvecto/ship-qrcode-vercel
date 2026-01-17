"use client";

import { useState } from "react";
import Link from "next/link";
import { Boat } from "@/types/boat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeDialog } from "./qr-generator";
import { Eye, QrCode } from "lucide-react";
import { vi } from "@/locales/vi";

interface BoatTableProps {
  boats: Boat[];
}

export function BoatTable({ boats }: BoatTableProps) {
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const handleGenerateQR = (boat: Boat) => {
    setSelectedBoat(boat);
    setQrDialogOpen(true);
  };

  if (boats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">{vi.admin.noBoatsFound}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{vi.boat.id}</TableHead>
              <TableHead>{vi.boat.boatNumber}</TableHead>
              <TableHead>{vi.boat.ownerName}</TableHead>
              <TableHead>{vi.boat.district}</TableHead>
              <TableHead>{vi.boat.boatGroup}</TableHead>
              <TableHead className="text-right">
                {vi.admin.generateQR}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boats.map((boat) => (
              <TableRow key={boat.id}>
                <TableCell>
                  <Badge variant="outline">{boat.id}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {boat.boat_number}
                </TableCell>
                <TableCell>{boat.owner_name}</TableCell>
                <TableCell>{boat.district}</TableCell>
                <TableCell>{boat.boat_group}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/boats/${boat.id}`}
                        target="_blank"
                        prefetch={false}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        {vi.admin.viewDetails}
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleGenerateQR(boat)}
                    >
                      <QrCode className="mr-1 h-4 w-4" />
                      {vi.admin.generateQR}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedBoat && (
        <QRCodeDialog
          boat={selectedBoat}
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
        />
      )}
    </>
  );
}
