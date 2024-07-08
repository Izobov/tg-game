export function feedback(type: "light" | "medium" | "heavy" | "rigid" | "soft" = "light") {
  window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
}
