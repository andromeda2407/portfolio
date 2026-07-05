import { describe, it, expect, beforeEach } from "vitest";
import { useWorldStore } from "./store";

function reset() {
  useWorldStore.setState({ phase: "idle", activeSection: null });
}

describe("world store phase machine", () => {
  beforeEach(reset);

  it("starts idle with no active section", () => {
    const s = useWorldStore.getState();
    expect(s.phase).toBe("idle");
    expect(s.activeSection).toBeNull();
  });

  it("runs the full happy-path cycle", () => {
    const s = () => useWorldStore.getState();
    s().selectBeacon("projects");
    expect(s().phase).toBe("walking");
    expect(s().activeSection).toBe("projects");
    s().arrived();
    expect(s().phase).toBe("docking");
    s().dockComplete();
    expect(s().phase).toBe("viewing");
    s().exitBay();
    expect(s().phase).toBe("exiting");
    s().returnComplete();
    expect(s().phase).toBe("idle");
    expect(s().activeSection).toBeNull();
  });

  it("ignores selectBeacon unless idle", () => {
    const s = () => useWorldStore.getState();
    s().selectBeacon("projects");
    s().selectBeacon("skills"); // ignored, still walking to projects
    expect(s().activeSection).toBe("projects");
  });

  it("ignores out-of-order transitions", () => {
    const s = () => useWorldStore.getState();
    s().dockComplete(); // not docking
    expect(s().phase).toBe("idle");
    s().arrived(); // not walking
    expect(s().phase).toBe("idle");
  });
});
