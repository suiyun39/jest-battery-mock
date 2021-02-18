import { BatteryManager } from "./BatteryManager";

export type BatteryEventType = "chargingchange" | "chargingtimechange" | "dischargingtimechange" | "levelchange";

export class BatteryMock {
  static mock(): void {
    if ("getBattery" in navigator) {
      throw new Error("navigator.getBattery is defined");
    }

    const manager = new BatteryManager();

    // 全局保存副本以提供给其他方法
    Object.defineProperty(navigator, "_battery_mock_storage", {
      configurable: true,
      value: manager,
    });

    Object.defineProperty(navigator, "getBattery", {
      configurable: true,
      value: () => Promise.resolve(manager),
    });
  }

  static clean(): void {
    if ("getBattery" in navigator) {
      delete navigator["getBattery"];
    }

    if ("_battery_mock_storage" in navigator) {
      delete navigator["_battery_mock_storage"];
    }
  }

  static dispatch(
    type: BatteryEventType,
    state: {
      charging?: boolean;
      chargingTime?: number;
      dischargingTime?: number;
      level?: number;
    }
  ): void {
    if (!("_battery_mock_storage" in navigator)) {
      throw new Error("battery api not mock");
    }

    const target = navigator._battery_mock_storage as BatteryManager;

    typeof state.charging !== "undefined" && (target.charging = state.charging);
    typeof state.chargingTime !== "undefined" && (target.chargingTime = state.chargingTime);
    typeof state.dischargingTime !== "undefined" && (target.dischargingTime = state.dischargingTime);
    typeof state.level !== "undefined" && (target.level = state.level);

    target.dispatchEvent(new Event(type));
  }
}