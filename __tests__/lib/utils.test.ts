import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
    });

    it("should handle conditional classes", () => {
      expect(cn("text-red-500", false && "bg-blue-500")).toBe("text-red-500");
      expect(cn("text-red-500", true && "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });

    it("should override conflicting Tailwind classes", () => {
      const result = cn("p-4", "p-8");
      expect(result).toBe("p-8");
    });

    it("should handle undefined and null", () => {
      expect(cn("text-red-500", undefined, null, "bg-blue-500")).toBe(
        "text-red-500 bg-blue-500"
      );
    });
  });
});
