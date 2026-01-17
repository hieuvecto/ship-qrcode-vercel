import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ship, QrCode, Shield, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">QR Code Tàu Cá</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              Quản trị
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-4">
              <Ship className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight">
            QR Code Tàu Cá Đà Nẵng
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tra cứu thông tin tàu cá nhanh chóng và chính xác thông qua mã QR
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-2">
                <QrCode className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-center">Quét QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Quét mã QR trên tàu để xem thông tin chi tiết về tàu cá, chủ tàu
                và nghề khai thác
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-center mb-2">
                <Ship className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-center">Thông tin đầy đủ</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Hiển thị thông tin đăng ký, loại tàu, số thuyền viên và thông
                tin liên hệ chủ tàu
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-center mb-2">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-center">Quản lý tập trung</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Hệ thống quản trị cho phép tạo mã QR, tìm kiếm và quản lý thông
                tin tàu cá
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Demo QR Code Section */}
        <Card className="max-w-3xl mx-auto mt-16 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Thử nghiệm ngay</CardTitle>
            <CardDescription className="text-base">
              Quét mã QR bên dưới bằng camera điện thoại để xem thông tin mẫu
              của tàu cá
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <QRCodeSVG
                    value={`${
                      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                    }/boats/1`}
                    size={200}
                    level="H"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-4 max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mở camera điện thoại</p>
                    <p className="text-sm text-muted-foreground">
                      Hoặc ứng dụng quét QR code
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Quét mã QR</p>
                    <p className="text-sm text-muted-foreground">
                      Hướng camera vào mã QR bên trái
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Xem thông tin</p>
                    <p className="text-sm text-muted-foreground">
                      Thông tin tàu hiển thị ngay
                    </p>
                  </div>
                </div>

                {/* Direct Link Button */}
                <div className="mt-4 pt-4 border-t">
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/boats/1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Hoặc xem trực tiếp tại đây
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="max-w-2xl mx-auto mt-16">
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quét mã QR</h3>
                <p className="text-muted-foreground">
                  Sử dụng camera điện thoại để quét mã QR được dán trên tàu cá
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Xem thông tin</h3>
                <p className="text-muted-foreground">
                  Thông tin chi tiết về tàu cá sẽ hiển thị ngay lập tức
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Liên hệ</h3>
                <p className="text-muted-foreground">
                  Sử dụng thông tin liên hệ được hiển thị để liên lạc với chủ
                  tàu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>QR Code Tàu Cá Đà Nẵng</p>
          <p className="mt-1">
            Sở Nông nghiệp và Phát triển Nông thôn Thành phố Đà Nẵng
          </p>
        </div>
      </footer>
    </div>
  );
}
