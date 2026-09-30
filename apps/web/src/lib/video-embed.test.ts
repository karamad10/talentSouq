import { describe, expect, it } from "vitest";
import { toEmbedUrl } from "./video-embed";

describe("toEmbedUrl", () => {
  it("normalises YouTube and Vimeo links to embeddable ones", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://www.youtube.com/embed/abc123");
    expect(toEmbedUrl("https://youtu.be/abc123")).toBe("https://www.youtube.com/embed/abc123");
    expect(toEmbedUrl("https://vimeo.com/12345")).toBe("https://player.vimeo.com/video/12345");
    expect(toEmbedUrl("https://www.youtube.com/embed/xyz")).toBe("https://www.youtube.com/embed/xyz");
  });

  it("refuses anything that is not https YouTube or Vimeo", () => {
    expect(toEmbedUrl("http://www.youtube.com/watch?v=abc")).toBeNull();
    expect(toEmbedUrl("https://evil.example.com/video")).toBeNull();
    expect(toEmbedUrl("https://youtube.com.evil.test/watch?v=a")).toBeNull();
    expect(toEmbedUrl("https://notvimeo.com/12345")).toBeNull();
    expect(toEmbedUrl("https://vimeo.com/notanumber")).toBeNull();
    expect(toEmbedUrl("https://www.youtube.com/")).toBeNull();
    expect(toEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(toEmbedUrl("not a url")).toBeNull();
  });
});
