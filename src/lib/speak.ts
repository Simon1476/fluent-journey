export function speakWord(word: string) {
  if (typeof window === "undefined") return; // 서버 환경 방지
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // 기존 음성 정리
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("이 브라우저에서는 음성 합성을 지원하지 않습니다.");
  }
}
