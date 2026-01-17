"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { Boat } from "@/types/boat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { vi } from "@/locales/vi";
import { toast } from "sonner";

interface QRCodeDialogProps {
  boat: Boat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({ boat, open, onOpenChange }: QRCodeDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const dataUrl = await toPng(qrRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `qr-${boat.boat_number}-${boat.id}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("QR code downloaded successfully!");
    } catch (error) {
      console.error("Error generating QR code image:", error);
      toast.error("Failed to download QR code. Please try again.");
    }
  };

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/boats/${boat.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {vi.qr.title} {boat.boat_number}
          </DialogTitle>
          <DialogDescription>
            {vi.qr.scanToView}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {/* QR Code Container */}
          <div
            ref={qrRef}
            className="flex flex-col items-center bg-white p-6 rounded-lg"
          >
            <QRCodeSVG
              value={qrUrl}
              size={256}
              level="H"
              includeMargin={true}
              // Logo can be added by replacing the SVG with a PNG at:
              // public/images/danang-fishery-logo.png
              // imageSettings={{
              //   src: "/images/danang-fishery-logo.png",
              //   height: 50,
              //   width: 50,
              //   excavate: true,
              // }}
            />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-gray-800">
                {boat.boat_number}
              </p>
              <p className="text-xs text-gray-600">{boat.owner_name}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-2">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              {vi.qr.download}
            </Button>
          </div>

          {/* URL Display */}
          <div className="w-full">
            <p className="text-xs text-muted-foreground break-all text-center">
              {qrUrl}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
